import jwt from 'jsonwebtoken';
import { BAD_REQUEST } from 'http-status';
import logger from '../../logger/logger';
import APIError from '../../utils/api-error';
import ApiResponse from '../../utils/api-response';
import { generate_sha_256 } from '../../utils/utilities';
import {
  add_user, email_found, get_user,
  update_user,
} from '../users/user.service';
import Config from '../../config/config';
import { generate_unique_password } from './auth.service';
import { send_email_without_template } from '../../utils/mailer';
import { get_pricing } from '../pricing/pricing.service';

export default class AuthControlelr {
  static register = async (req: any, res: any) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // if email already exist
      const email_exist = await email_found(email);
      if (email_exist) {
        throw new APIError(
          'Email already exist',
          BAD_REQUEST,
        );
      }

      const password_hash = generate_sha_256(password);

      // get pricing plan
      const pricing = await get_pricing(Config.default_pricing_code);
      const credit = Number(
        Config.default_cost_per_request,
      ) * Number(pricing.requests_limit_per_month);

      const user: any = await add_user({
        password: password_hash,
        email: email.toLowerCase(),
        plan: pricing._id,
        usage: {
          credit_balance: credit,
          requests_made_since_history: 0,
          requests_made_this_month: 0,
          requests_made_this_day: 0,
          requests_made_this_minute: 0,
          failed_requests: 0,
        },
      });

      // prepare jwt payload
      const payload = {
        id: user._id,
        email: user.email,
      };

      // encode jwt
      const encode_jwt = jwt.sign(payload, Config.jwtSecret);

      return ApiResponse.success(
        res,
        'Successful',
        {
          token: encode_jwt,
          user,
        },
      );
    } catch (e: any) {
      logger.error(e.message);

      return ApiResponse.error(
        res,
        e.statusCode || 500,
        e.message || 'Unable to create account',
      );
    }
  };

  static login = async (req: any, res: any) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const user = await get_user(email);
      const user_password = user.password || '';

      const hash_password = generate_sha_256(password).substring(
        0,
        user_password.length,
      );

      if (user_password !== hash_password) {
        throw new APIError(
          'Invalid account credentials, unable to grant user access.',
          BAD_REQUEST,
        );
      }

      user.password = '';

      logger.info(`Signin for ${email} and password ${user_password}`);

      // prepare jwt payload
      const payload = {
        id: user.id,
        email: user.email,
      };

      // encode jwt
      const encode_jwt = jwt.sign(payload, Config.jwtSecret);

      return ApiResponse.success(
        res,
        'Successful',
        {
          user_token: encode_jwt,
          user,
        },
      );
    } catch (e: any) {
      logger.error(e.message);

      return ApiResponse.error(
        res,
        e.statusCode || 500,
        e.message || 'Unable to signin',
      );
    }
  };

  static send_verification_code = async (req: any, res: any) => {
    try {
      const {
        email,
      } = req.body;

      const code = generate_unique_password(6);

      // update user verify code
      const user = await update_user(email, {
        verify_code: code,
      });

      // send email with code
      await send_email_without_template(
        email,
        'Verification Code',
        `Your verification code is ${code}`,
      );

      return ApiResponse.success(
        res,
        'Successful',
        user,
      );
    } catch (e: any) {
      logger.error(e.message);
      throw new APIError(e.message || 'Unable to send verification code');
    }
  };

  static change_password = async (req: any, res: any) => {
    try {
      const {
        email,
        password,
        verify_code,
      } = req.body;

      // get user
      const user = await get_user(email);

      if (!user.verify_code) {
        throw new APIError(
          'Invalid verification request',
          BAD_REQUEST,
        );
      }

      // check if code is correct
      if (user.verify_code !== verify_code) {
        throw new APIError(
          'Invalid verification code',
          BAD_REQUEST,
        );
      }

      // update user password
      const password_hash = generate_sha_256(password);
      const updated_user = await update_user(email, {
        password: password_hash,
        verify_code: '',
      });

      return ApiResponse.success(
        res,
        'Successful',
        updated_user,
      );
    } catch (e: any) {
      logger.error(e.message);
      throw new APIError(e.message || 'Unable to change password');
    }
  };
}
