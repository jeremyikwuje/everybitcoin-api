import axios from 'axios';
import logger from '../logger/logger';

export const request_api = async (
  url: string,
  method: string,
  headers: object | undefined = undefined,
  data: object | string = {},
) => {
  try {
    const axiosOptions: any = {
      url,
      method,
      data,
    };

    if (headers) {
      axiosOptions.headers = headers;
    }

    const response = await axios(axiosOptions);

    return response.data;
  } catch (e: any) {
    let error: any = {};

    if (e.response) {
      error = e.response.data;
    } else if (e.request) {
      error = {
        message: 'Unable to connect to API',
      };
    }

    logger.error(e);

    return { error };
  }
};
