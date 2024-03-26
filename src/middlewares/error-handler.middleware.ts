import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ValidationError } from 'express-validation';
import logger from '../logger/logger';
import APIError from '../utils/api-error';
import ApiResponse from '../utils/api-response';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.stack || err);

  if (res.headersSent) {
    // If headers have been sent, delegate to the default Express error handler
    return next(err);
  }

  if (err instanceof ValidationError) {
    // validation error contains details object which has error message attached to error property.
    const allErrors = (err.details.body || err.details.query || err.details.params)?.map(
      (pathErrors) => pathErrors.message,
    ) || [];
    const unifiedErrorMessage = allErrors
      .join(', ')
      .replace(/, ([^,]*)$/, ' and $1');

    console.log('Validation error');

    return ApiResponse.error(
      res,
      err.statusCode,
      unifiedErrorMessage,
    );
  }

  if (err instanceof APIError) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message:
        process.env.NODE_ENV === 'development'
          ? err.stack
          : 'INTERNAL_SERVER_ERROR',
    data: null,
  });
};

export default errorHandler;
