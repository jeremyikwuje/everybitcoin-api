import httpStatus from 'http-status';
import ApiResponse from '../utils/api-response';
import { getBusinessWithAPISecret } from '../modules/business/business.service';
import logger from '../logger/logger';

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const apiKey = (req.headers as any).authorization.split(' ')[1];

    // todo: cache data in redis
    req.business = await getBusinessWithAPISecret(apiKey);
    console.log(req.business);

    if (!req.business.isActive) {
      throw new Error('Business is inactive');
    }

    return next();
  } catch (error: any) {
    logger.error(error.message);
    return ApiResponse.error(res, httpStatus.UNAUTHORIZED, 'Unauthorized API access');
  }
};

export const isKYCVerified = async (
  req: any,
  res: any,
  next: any,
) => {
  const { business } = req;

  try {
    if (business?.isKYCVerified === false) {
      throw new Error('Business is not KYC verified');
    }

    return next();
  } catch (e: any) {
    logger.error(e.message);
    return ApiResponse.error(res, 401, 'Complete your KYC Verification');
  }
};
