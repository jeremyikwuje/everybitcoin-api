import { isObject } from 'lodash';
import logger from './logger';
import { truncateLargeFieldsInObject } from './truncate-large-object-fields';

export const AxiosInterceptors = [
  (response: any) => Promise.resolve(response),
  (error: any) => {
    const method = error?.response?.config?.method?.toUpperCase();
    const data = error?.response?.config?.data;
    const response = isObject(error?.response?.data)
      ? truncateLargeFieldsInObject(error?.response?.data)
      : error?.response?.data;

    logger.error(
      `ERROR: ${method} ${error?.response?.config?.url} \n\nData: ${
        isObject(data) ? truncateLargeFieldsInObject(data) : data
      }\n\nResponse: ${JSON.stringify(response)}`,
    );
    return Promise.reject(error);
  },
];
