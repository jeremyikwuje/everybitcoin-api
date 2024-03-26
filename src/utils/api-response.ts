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

  static error = (res: express.Response, code: number, message: string) => {
    const body = {
      status: 'error',
      message,
      data: null,
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
