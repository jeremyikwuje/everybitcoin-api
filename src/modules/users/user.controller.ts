import httpStatus, { BAD_REQUEST } from 'http-status';
import {
  Channel, Currency, ERROR_CODE, ERROR_MESSAGE, RequestState,
} from '../../constants';
import logger from '../../logger/logger';
import ApiResponse, { ErrorType } from '../../utils/api-response';
import { IUser, SubscriptionStatus } from './user.enums';
import {
  delete_user,
  get_user,
  update_user,
} from './user.service';
import { get_pricing } from '../pricing/pricing.service';
import { generate_reference_number } from '../../utils/utilities';
import {
  add_subscription,
  confirm_subscription_payment,
  get_active_subscriptions,
  get_subscription,
  initiate_payment,
  update_subscription,
} from './services/subscription.service';
import Subscription from './models/subscription.model';
import APIError from '../../utils/api-error';
import Config from '../../config/config';
import { PaymentStatus } from '../pricing/pricing.enums';

export default class UserController {
  static get_user = async (req: any, res: any) => {
    try {
      let {
        id,
      } = req.query;

      if (!id) {
        id = req.user._id;
      }

      const user = await get_user(id);

      return ApiResponse.success(
        res,
        'Successful',
        user,
      );
    } catch (error: any) {
      logger.error(error.message || ERROR_MESSAGE);

      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static get_users = async (req: any, res: any) => {
    try {
      // const {
      //   page,
      //   limit,
      //   search,
      //   is_investor,
      //   is_business,
      //   is_individual,
      //   is_admin,
      //   is_active,
      // } = req.query;

      return ApiResponse.success(
        res,
        'Successful',
        {},
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorCode || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static update_user = async (req: any, res: any) => {
    try {
      let {
        id,
      } = req.query;

      if (!id) {
        id = req.user._id;
      }

      const {
        firstname,
        lastname,
        country,
        links,
        business_name,
        is_active,
        is_business,
        is_individual,
        is_investor,
        address,
        avatar,
      } = req.body;

      const updates: IUser = {};

      if (firstname) {
        updates.firstname = firstname;
      }
      if (lastname) {
        updates.lastname = lastname;
      }
      if (country) {
        updates.country = country;
      }
      if (business_name) {
        updates.business_name = business_name;
      }
      if (links) {
        updates.links = links;
      }
      if (address) {
        updates.address = address;
      }
      if (is_investor) {
        updates.is_investor = is_investor;
      }
      if (is_individual) {
        updates.is_individual = is_individual;
      }
      if (is_business) {
        updates.is_business = is_business;
      }
      if (avatar) {
        updates.avatar = avatar;
      }
      if (is_active) {
        updates.is_active = is_active;
      }

      const updated_user = await update_user(id, updates);

      return ApiResponse.success(
        res,
        'Successful',
        updated_user,
      );
    } catch (error: any) {
      logger.error(error.message || ERROR_MESSAGE);

      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static update_user_usage = async (req: any, res: any) => {
    try {
      let {
        id,
      } = req.query;

      if (!id) {
        id = req.user._id;
      }

      const usage = req.body;
      const updated_user = await update_user(id, {
        usage,
      });

      return ApiResponse.success(
        res,
        'Successful',
        updated_user,
      );
    } catch (error: any) {
      logger.error(error.message || ERROR_MESSAGE);

      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static delete_user = async (req: any, res: any) => {
    try {
      let {
        id,
      } = req.query;

      if (!id) {
        id = req.user._id;
      }

      const deleted_user = await delete_user(id);

      return ApiResponse.success(
        res,
        'Successful',
        deleted_user,
      );
    } catch (error: any) {
      logger.error(error.message || 'Error deleting user');

      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static create_subscription = async (req: any, res: any) => {
    try {
      const { user } = req;
      const {
        plan,
        units,
        payment_channel,
        redirect_url,
      } = req.body;

      const pricing = await get_pricing(plan);

      // check if there is exisitng subscriptions
      const existing_subscriptions = await get_active_subscriptions(user._id);
      if (existing_subscriptions.length > 0) {
        throw new APIError(
          'You have active subscriptions',
          BAD_REQUEST,
        );
      }

      // get one day ago
      const one_day_ago = new Date();
      one_day_ago.setDate(one_day_ago.getDate() - 1);

      let subscription = await Subscription.findOne({
        user: user._id,
        status: SubscriptionStatus.Inactive,
        payment_status: RequestState.Created,
        created_at: {
          $gte: one_day_ago,
        },
      }).sort({ createdAt: -1 });

      if (!subscription) {
        const reference = await generate_reference_number(`M${pricing.code.toUpperCase()}`);

        const payment_info = await initiate_payment({
          title: `${Config.app_name} | ${pricing.name} plan - ${pricing.billing_cycle}`,
          description: `Payment for ${pricing.name} plan - ${pricing.billing_cycle}`,
          amount: +pricing.price * +units,
          currency: pricing.currency as Currency || Currency.USD,
          reference,
          customer: {
            email: user.email,
          },
          channel: payment_channel,
          channel_reference: reference,
          redirect_url,
        });

        // new start date is the current end date
        const start_date = new Date();
        // new end date is 30 days plus the current end date
        const end_date = new Date(
          new Date(start_date).setDate(
            new Date(start_date).getDate() + 30,
          ),
        );
        // payment expiry data should be the start date + 7 days
        const payment_expiry_date = new Date(
          new Date(start_date).setDate(
            new Date(start_date).getDate() + 7,
          ),
        );

        // create subscription
        subscription = await add_subscription({
          user: user._id,
          amount: {
            unit: Currency.USD,
            value: payment_info.amount,
          },
          plan: pricing._id,
          units: Number(units),
          reference: payment_info.reference,
          status: SubscriptionStatus.Pending,
          start_date,
          end_date,
          payment_reference: payment_info.channel_reference || payment_info.reference,
          payment_channel: payment_info.channel,
          payment_status: PaymentStatus.Unpaid,
          payment_link: payment_info.checkout_link,
          payment_expiry_date,
        });
      }

      return ApiResponse.success(
        res,
        'Successful',
        subscription,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorCode || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static initiate_subcription_payment = async (req: any, res: any) => {
    try {
      const {
        reference,
        payment_channel,
        redirect_url,
      } = req.body;

      const subscription = await get_subscription(reference);
      if (payment_channel) {
        subscription.payment_channel = payment_channel;
      }

      // create payment link
      const payment_info = await initiate_payment({
        title: `${Config.app_name} | ${subscription.plan.name} plan - ${subscription.plan.billing_cycle}`,
        description: `Payment for ${subscription.plan.name} plan - ${subscription.plan.billing_cycle}`,
        amount: Number(subscription.amount.value),
        currency: subscription.amount.unit as Currency,
        reference: subscription.reference,
        customer: {
          email: subscription.user.email,
        },
        channel: subscription.payment_channel as Channel,
        channel_reference: subscription.payment_reference,
        redirect_url: redirect_url || '',
      });

      subscription.payment_link = payment_info.checkout_link || '';

      await update_subscription(subscription.reference, subscription);

      return ApiResponse.success(
        res,
        'Successful',
        {
          payment_info,
          subscription,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorCode || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static confirm_subscription = async (req: any, res: any) => {
    const { user } = req;
    const {
      reference,
    } = req.query;

    try {
      const subscription = await get_subscription(reference);
      if (subscription.payment_status === PaymentStatus.Paid) {
        throw new APIError(
          'Subscription payment already confirmed',
          BAD_REQUEST,
        );
      }

      if (subscription.user.toString() !== user._id.toString()) {
        throw new APIError(
          'Invalid subscription reference',
          BAD_REQUEST,
        );
      }

      const result = await confirm_subscription_payment(subscription);

      return ApiResponse.success(
        res,
        'Successful',
        result,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };
}
