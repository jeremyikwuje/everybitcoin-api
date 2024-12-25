import { redis_instance } from '../database/redis';
import logger from '../logger/logger';
import APIError from '../utils/api-error';
import ApiResponse, { ErrorType } from '../utils/api-response';

const RATE_LIMIT_WINDOW = 60;
const MAX_REQUESTS_PER_WINDOW = 12;

const redis = redis_instance();

export const ip_rate_limiter = async (req: any, res: any, next: any) => {
  const { ip } = req;
  if (!ip) {
    return next();
  }

  try {
    const key = `${ip}:requests`;
    // Increment the request count for the IP
    const request_count = await redis.incr(key);

    if (request_count === 1) {
      // Set the expiration time for the key if it's the first request
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    if (request_count > MAX_REQUESTS_PER_WINDOW) {
      // If the request count exceeds the limit, return an error response
      throw new APIError(
        'Rate limit exceeded',
        429,
        ErrorType.RateLimitExceeded,
      );
    }

    return next();
  } catch (error: any) {
    logger.error(error.message || 'Rate limiter error');
    return ApiResponse.error(
      res,
      error.statusCode || 500,
      error.errorType || ErrorType.InternalError,
      error.message || 'Rate limiter error',
    );
  }
};

export const api_user_rate_limiter = async (req: any, res: any, next: any) => {
  const { user } = req;
  if (!user) {
    return next();
  }

  const { plan } = user;
  if (!plan) {
    return next();
  }

  const {
    requests_limit_per_minute,
    requests_limit_per_month,
  } = plan;

  try {
    const key = `${user._id}:user-requests`;
    const monthly_key = `${user._id}:user-monthly-requests:${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    // Increment the request count for the user
    const request_count = await redis.incr(key);
    const monthly_request = await redis.get(monthly_key);
    const monthly_request_count = monthly_request ? parseInt(monthly_request, 10) : 0;

    if (request_count === 1) {
      // Set the expiration time for the key if it's the first request
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }
    if (monthly_request_count === 1) {
      // Set the expiration time for the key if it's the first request
      await redis.expire(monthly_key, 30 * 24 * 60 * 60);
    }

    if (request_count > requests_limit_per_minute) {
      // If the request count exceeds the limit, return an error response
      throw new APIError(
        'Rate limit exceeded',
        429,
        ErrorType.RateLimitExceeded,
      );
    }
    if (monthly_request_count > requests_limit_per_month) {
      // If the request count exceeds the limit, return an error response
      throw new APIError(
        'Monthly request limit reached',
        429,
        ErrorType.RequestLimitReached,
      );
    }

    return next();
  } catch (error: any) {
    logger.error(error.message || 'Rate limiter error');
    return ApiResponse.error(
      res,
      error.statusCode || 500,
      error.errorType || ErrorType.InternalError,
      error.message || 'Rate limiter error',
    );
  }
};
