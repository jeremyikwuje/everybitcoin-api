import express from 'express';

export default class ApiResponse {
  static success = (res: express.Response, message: string, data: object = {}) => {
    const body = {
      status: 'success',
      message,
      data,
    };

    return res.status(200).json(body).end();
  };

  static error = (
    res: express.Response,
    code: number,
    message: string,
    description?: string,
  ) => {
    const body = {
      status: 'error',
      message,
      description,
    };

    return res.status(code).json(body).end();
  };

  static pending = async (
    res: express.Response,
    message: string,
    data: object = {},
  ) => {
    const body = {
      status: 'pending',
      message,
      data,
    };

    return res.status(200).json(body).end();
  };
}

export const enum ErrorType {
  AccountDisabled = 'disabled',
  NoCredit = 'no_credit',
  RequestLimitReached = 'request_limit_reached',
  BadRequest = 'bad_request',
  BadInput = 'bad_input',
  EmailExist = 'email_exist',
  Duplicate = 'duplicate_record',
  InvalidCurrencyCode = 'invalid_currency_code',
  NotFound = 'not_found',
  ServiceUnavailable = 'service_unavailable',
  RateLimitExceeded = 'rate_limit_exceeded',
  InvalidAmount = 'invalid_amount',
  UnauthorizedAccess = 'unauthorized_access',
  InternalError = 'internal_error',
  InvalidDate = 'invalid_date',
  CurrencyPairNotSupported = 'currency_pair_not_supported',
  MissingParameters = 'missing_parameters',
}

export const enum SuccessType {
  Created = 'created',
  Updated = 'updated',
  Deleted = 'deleted',
  Retrieved = 'retrieved',
  Processed = 'processed',
  Approved = 'approved',
  Rejected = 'rejected',
  Activated = 'activated',
  Deactivated = 'deactivated',
  Enabled = 'enabled',
  Disabled = 'disabled',
  Sent = 'sent',
  Verified = 'verified',
  Resent = 'resent',
  Added = 'added',
  Removed = 'removed',
  Registered = 'registered',
  LoggedIn = 'logged_in',
  LoggedOut = 'logged_out',
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
  ApprovedPayment = 'approved_payment',
  RejectedPayment = 'rejected_payment',
  UpdatedPayment = 'updated_payment',
  CancelledPayment = 'cancelled_payment',
  ProcessedPayment = 'processed_payment',
  VerifiedPayment = 'verified_payment',
  ResentPayment = 'resent_payment',
  AddedPayment = 'added_payment',
  RemovedPayment = 'removed_payment',
  RegisteredPayment = 'registered_payment',
  LoggedInPayment = 'logged_in_payment',
  LoggedOutPayment = 'logged_out_payment',
  SubscribedPayment = 'subscribed_payment',
  UnsubscribedPayment = 'unsubscribed_payment',
}
