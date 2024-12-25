import httpStatus, { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import ApiResponse, { ErrorType } from '../utils/api-response';
import logger from '../logger/logger';
import Config from '../config/config';
import { get_user } from '../modules/users/user.service';
import APIError from '../utils/api-error';
import { AdminRoles } from '../modules/users/user.enums';
import { generate_sha_256 } from '../utils/utilities';

const node_cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 300,
});

const authenticate_access_token = async (user_token: string) => {
  // decrypt JWT
  const decoded_jwt: any = jwt.verify(
    user_token,
    Config.jwtSecret,
  );

  let req_user: any;

  // if cache is set
  const cache = node_cache.get(decoded_jwt.id);
  if (cache) {
    req_user = cache;
  } else {
    // get the user from db
    req_user = await get_user(decoded_jwt.id);
    node_cache.set(decoded_jwt.id, req_user);
  }

  if (!req_user.is_active) {
    throw new APIError(
      'Account is not active',
      FORBIDDEN,
      ErrorType.AccountDisabled,
    );
  }

  return req_user;
};

const authenticate_api_key = async (api_key: string) => {
  let req_user: any;

  // if cache is set
  const cache = node_cache.get(api_key);
  if (cache) {
    req_user = cache;
  } else {
    // get the user from db
    const hashed_api_key = generate_sha_256(api_key);
    req_user = await get_user(hashed_api_key);
    node_cache.set(api_key, req_user);
  }

  return req_user;
};

export const user_middleware = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const api_key = (req.query as any).api_key
        || (req.headers as any).authorization
        || null;
    const user_token = (req.headers as any).user_token || null;

    if (api_key) {
      req.user = await authenticate_api_key(api_key);
      res.locals.user_id = req.user._id;
    } else if (user_token) {
      req.user = await authenticate_access_token(user_token);
      res.locals.user_id = req.user._id;
    } else {
      throw new APIError(
        'Invalid access',
        UNAUTHORIZED,
        ErrorType.UnauthorizedAccess,
      );
    }

    console.log('user', req.user);

    if (!req.user.is_active) {
      throw new APIError(
        'Account is not active',
        FORBIDDEN,
        ErrorType.AccountDisabled,
      );
    }

    return next();
  } catch (error: any) {
    logger.error(error.message);

    return ApiResponse.error(
      res,
      error.statusCode || UNAUTHORIZED,
      error.errorType || ErrorType.InternalError,
      error.message || 'Unauthorized API access',
    );
  }
};

export const admin_middleware = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    if (!req.user) {
      throw new APIError(
        'Unable to retrieve user credentials.',
        FORBIDDEN,
        ErrorType.InternalError,
      );
    }

    if (req.admin_role !== AdminRoles.Admin) {
      throw new APIError(
        'You are not allowed to access this endpoint.',
        FORBIDDEN,
        ErrorType.UnauthorizedAccess,
      );
    }

    return next();
  } catch (error: any) {
    logger.error(error.message);

    return ApiResponse.error(
      res,
      error.statusCode || httpStatus.UNAUTHORIZED,
      error.errorCode || ErrorType.InternalError,
      error.message || 'Endpoint is not available.',
    );
  }
};
