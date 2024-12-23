import mongoose from 'mongoose';
import httpStatus, { NOT_FOUND } from 'http-status';
import Subscription from '../models/subscription.model';
import {
  INewSubscription,
  IPaymentInfo,
  ISubscription,
  SubscriptionStatus,
} from '../user.enums';
import APIError from '../../../utils/api-error';
import { ErrorType } from '../../../utils/api-response';
import { reset_user_plan, upgrade_user_plan } from '../user.service';
import { Channel, Currency, RequestState } from '../../../constants';
import { PaymentStatus } from '../../pricing/pricing.enums';
import { dollar_to_cent, generate_reference_number } from '../../../utils/utilities';
import { Flutterwave } from '../../../integrations/flutterwave/flutterwave.integration';
import { StripeMethods } from '../../../integrations/stripe/stripe.integration';
import { Paystack } from '../../../integrations/paystack/paystack.integration';
import logger from '../../../logger/logger';

const BATCH_SIZE = 100; // Define the batch size
const BILLING_DAY = 27; // Define the billing day
const BILLING_DAYS = 30; // Define the billing days
const PAYMENT_DUE_DAYS = 3; // Define the payment due days
const PAYMENT_EXPIRY_DAYS = 7; // Define the payment expiry days

export const add_subscription = async (data: INewSubscription) => {
  try {
    // create user
    const subscription = new Subscription(data);
    await subscription.save();
    await subscription.populate('plan');

    return subscription;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating subscription');
  }
};

export const get_subscription = async (unique: string) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = {
      $or: [
        { reference: unique },
        { payment_reference: unique },
      ],
    };
  }

  const user = await Subscription.findOne(query).populate('plan');

  if (!user) {
    throw new APIError(
      'No subscription found',
      NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return user;
};

export const get_active_subscriptions = async (user: string) => {
  const subscriptions = await Subscription.find({
    user,
    status: SubscriptionStatus.Active,
  });

  return subscriptions;
};

export const update_subscription = async (
  unique: string,
  data: Partial<ISubscription>,
) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = {
      $or: [
        { reference: unique },
        { payment_reference: unique },
      ],
    };
  }

  // update user
  const subscription = await Subscription.findOneAndUpdate(query, data, { new: true });
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  return subscription;
};

export const initiate_payment = async (
  payment_info: IPaymentInfo,
) => {
  const new_payment_info = payment_info;

  let payment_response: any;
  switch (payment_info.channel) {
    case Channel.Flutterwave:
      payment_response = await Flutterwave.create_payment({
        customer: {
          email: payment_info.customer.email,
        },
        tx_ref: payment_info.reference,
        amount: payment_info.amount,
        redirect_url: payment_info.redirect_url,
        currency: payment_info.currency,
        customizations: {
          title: payment_info.title,
          description: payment_info.description,
        },
      });
      new_payment_info.checkout_link = payment_response.link;
      break;
    case Channel.Paystack:
      payment_response = await Paystack.create_payment({
        email: payment_info.customer.email,
        reference: payment_info.reference,
        amount: dollar_to_cent(payment_info.amount),
        callback_url: payment_info.redirect_url,
        currency: payment_info.currency,
      });
      new_payment_info.checkout_link = payment_response.link;
      break;
    case Channel.Stripe:
      payment_response = await StripeMethods.create_payment({
        title: payment_info.title,
        description: payment_info.description || payment_info.title,
        amount: dollar_to_cent(payment_info.amount),
        currency: payment_info.currency,
        client_reference: payment_info.reference,
        success_url: payment_info.redirect_url,
        cancel_url: payment_info.redirect_url,
      });

      new_payment_info.checkout_link = payment_response.url;
      new_payment_info.channel_reference = payment_response.id;
      break;
    default:
      throw new Error('Invalid payment channel');
  }

  return new_payment_info;
};

export const issue_subscriptions = async (skip = 0): Promise<void> => {
  const today = new Date();
  const seven_days_later = new Date(today.setDate(today.getDate() + PAYMENT_DUE_DAYS));

  logger.info(`Issuing subscriptions for ${seven_days_later}`);

  // Fetch a batch of active subscriptions
  const subscriptions = await Subscription.find({
    status: SubscriptionStatus.Active,
    end_date: {
      $gte: today,
      $lte: seven_days_later,
    },
    is_next_payment_ready: false,
  })
    .skip(skip)
    .limit(BATCH_SIZE)
    .populate('user')
    .populate('plan');

  if (subscriptions.length === 0) {
    return;
  }

  // Process each subscription in the batch
  await Promise.all(subscriptions.map(async (subscription) => {
    // new start date is the current end date
    const new_start_date = new Date(subscription.end_date);
    // new end date is 30 days plus the current end date
    const new_end_date = new Date(
      new Date(subscription.end_date).setDate(
        new Date(subscription.end_date).getDate() + BILLING_DAYS,
      ),
    );
    // payment expiry data should be the subscription end date + 7 days
    const payment_expiry_date = new Date(
      new Date(subscription.end_date).setDate(
        new Date(subscription.end_date).getDate() + PAYMENT_EXPIRY_DAYS,
      ),
    );

    const invoice = {
      amount: subscription.plan.price,
      currency: subscription.plan.currency || Currency.USD,
      user: subscription.user._id,
      plan: subscription.plan._id,
      units: subscription.units,
      reference: generate_reference_number(
        `INV${subscription.plan.code.toUpperCase()}`,
      ),
      payment_expiry_date,
    };

    await add_subscription({
      user: invoice.user,
      amount: {
        unit: invoice.currency,
        value: invoice.amount,
      },
      plan: invoice.plan,
      units: invoice.units,
      status: SubscriptionStatus.Active,
      reference: invoice.reference,
      start_date: new_start_date,
      end_date: new_end_date,
      payment_channel: Channel.Flutterwave,
      payment_status: PaymentStatus.Unpaid,
      payment_reference: invoice.reference,
      payment_expiry_date: invoice.payment_expiry_date,
    });

    // Update the subscription to reflect the next billing cycle
    await update_subscription(subscription.reference, {
      is_next_payment_ready: true,
    });
  }));

  // Move to the next batch
  await issue_subscriptions(skip + BATCH_SIZE);
};

export const issue_next_subscriptions = async (skip = 0): Promise<void> => {
  const today = new Date();
  const current_month = today.getMonth();
  const current_year = today.getFullYear();

  // Calculate the next billing date
  const next_billing_date = new Date(current_year, current_month, BILLING_DAY);
  if (today.getDate() > BILLING_DAY) {
    next_billing_date.setMonth(current_month + 1);
  }

  // Fetch a batch of active subscriptions
  const subscriptions = await Subscription.find({
    status: SubscriptionStatus.Active,
  })
    .skip(skip)
    .limit(BATCH_SIZE)
    .populate('user')
    .populate('plan');

  if (subscriptions.length === 0) {
    return;
  }

  // Process each subscription in the batch
  await Promise.all(subscriptions.map(async (subscription) => {
    // Calculate the prorated amount for the first month
    const days_in_month = new Date(
      current_year,
      current_month + 1,
      0,
    ).getDate();
    const days_remaining = days_in_month - today.getDate();
    const prorated_amount = Math.round(
      (subscription.plan.price / days_in_month) * days_remaining,
    );

    logger.info(`Issuing next subscription for user: ${subscription.user.email} is ${prorated_amount}`);
  }));

  // Move to the next batch
  await issue_subscriptions(skip + BATCH_SIZE);
};

export const cancel_expired_subscriptions = async () => {
  const subscriptions = await Subscription.updateMany({
    status: SubscriptionStatus.Active,
    end_date: {
      $lt: new Date(),
    },
  }, {
    status: SubscriptionStatus.Expired,
  });

  return subscriptions;
};

export const cancel_unpaid_subscriptions = async (skip = 0): Promise<void> => {
  try {
    // Fetch a batch of unpaid transactions
    const subscriptions = await Subscription.find({
      payment_status: PaymentStatus.Unpaid,
      payment_expiry_date: {
        $lt: new Date(),
      },
    })
      .skip(skip)
      .limit(BATCH_SIZE);

    if (subscriptions.length === 0) {
      return;
    }

    // Process each subscription in the batch and cancel the subscription
    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        // Downgrade the user to free plan
        await reset_user_plan(subscription.user);
        await update_subscription(subscription.reference, {
          status: SubscriptionStatus.Cancelled,
        });
      } catch (error: any) {
        logger.error(
          error.message
            || `Error cancelling subscription: ${subscription.reference}`,
        );
      }
    }));
  } catch (error: any) {
    logger.error(
      error.message
        || 'Error cancelling unpaid subscriptions',
    );
  }

  // Move to the next batch
  await cancel_unpaid_subscriptions(skip + BATCH_SIZE);
};

export const confirm_subscription_payment = async (subscription: ISubscription) => {
  try {
    logger.info(`Confirming subscription payment: ${subscription.reference}`);

    const updated_subscription: ISubscription = subscription;
    const reference = subscription.reference || subscription.payment_reference || '';
    const channel = subscription.payment_channel || Channel.Stripe;

    let response: any;

    switch (channel) {
      case Channel.Flutterwave:
        response = await Flutterwave.verify_payment(reference);
        break;
      case Channel.Stripe:
        response = await StripeMethods.verify_payment(subscription.payment_reference || reference);
        break;
      case Channel.Paystack:
        response = await Paystack.verify_payment(reference);
        break;
      default:
        throw new APIError(
          'Unable to verify subscription',
        );
    }

    // verify amount
    if (response.amount !== subscription.amount?.value) {
      throw new APIError(
        `Invalid payment amount for subscription: ${subscription.reference}`,
        httpStatus.CONFLICT,
      );
    }

    // update subscription status
    if (response.status === RequestState.Successful) {
      updated_subscription.status = SubscriptionStatus.Active;
      updated_subscription.payment_status = PaymentStatus.Paid;

      // change user plan
      await upgrade_user_plan(subscription.user, subscription.plan.code || subscription.plan);
    }
    updated_subscription.payment_reference = response.channel_reference;
    updated_subscription.payment_logs?.push(response.channel_response);

    const result = await update_subscription(
      reference,
      updated_subscription,
    );

    return result;
  } catch (error: any) {
    logger.error(
      error.message
        || `Error confirming subscription payment: ${subscription.reference}`,
    );
    throw new APIError(
      error.message || 'Error confirming subscription payment',
    );
  }
};

export const verify_subscription_payments = async (skip = 0): Promise<void> => {
  const subscriptions = await Subscription.find({
    status: {
      $in: [SubscriptionStatus.Active, SubscriptionStatus.Pending],
    },
    payment_status: PaymentStatus.Unpaid,
    payment_expiry_date: {
      $gt: new Date(),
    },
  }).skip(skip)
    .limit(BATCH_SIZE);

  if (subscriptions.length === 0) {
    return;
  }

  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await confirm_subscription_payment(subscription);
    } catch (error: any) {
      logger.error(
        error.message
          || `Error verifying subscription payment: ${subscription.reference}`,
      );
    }
  }));

  await verify_subscription_payments(skip + BATCH_SIZE);
};
