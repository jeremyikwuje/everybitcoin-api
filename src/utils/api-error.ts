import httpStatus from 'http-status';

class APIError extends Error {
  message: string;

  statusCode: number;

  errorType: string;

  constructor(
    message: string,
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    errorType: string = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType
      || Object.entries(httpStatus || {}).find(
        ([, val]) => val === statusCode,
      )?.[0]
      || 'INTERNAL_SERVER_ERROR';
    this.message = message;
  }

  public toJSON() {
    return {
      status: 'error',
      message: this.message,
      errorCode: this.errorType,
      data: null,
    };
  }
}

export default APIError;
