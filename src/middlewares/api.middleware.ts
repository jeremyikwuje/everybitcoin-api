import httpStatus, { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import NodeCache from 'node-cache';
import ApiResponse, { ErrorType } from '../utils/api-response';
import logger from '../logger/logger';
import Config from '../config/config';
import { get_user } from '../modules/users/user.service';
import { generate_sha_256 } from '../utils/utilities';
import APIError from '../utils/api-error';

const node_cache = new NodeCache({ stdTTL: 100, checkperiod: 300 });

export const apiMiddleware = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const api_key = (req.query as any).api_key
        || (req.headers as any).authorization
        || null;

    if (!api_key) {
      throw new Error('Invalid user access token');
    }

    // if cache is set
    const cache = node_cache.get(api_key);
    if (cache) {
      req.user = cache;
    } else {
      // get the user from db
      const hashed_api_key = generate_sha_256(api_key);
      req.user = await get_user(hashed_api_key);
      if (!req.user) {
        throw new APIError(
          'No account found',
          UNAUTHORIZED,
          ErrorType.UnauthorizedAccess,
        );
      }

      node_cache.set(api_key, req.user);
    }

    if (!req.user.is_active) {
      throw new APIError(
        'Account is not active',
        FORBIDDEN,
        ErrorType.AccountDisabled,
      );
    }
    if (req.user.usage.credit < Config.default_cost_per_request) {
      throw new APIError(
        `You have low credits. Please visit ${Config.publicUrl}/credits to buy more credits.`,
        FORBIDDEN,
        ErrorType.NoCredit,
      );
    }

    logger.info(JSON.stringify(req.app));

    return next();
  } catch (error: any) {
    logger.error(error.message || 'Internal error occured.');

    return ApiResponse.error(
      res,
      httpStatus.UNAUTHORIZED,
      error.errorType || ErrorType.InternalError,
      error.message || 'Unauthorized API access',
    );
  }
};
