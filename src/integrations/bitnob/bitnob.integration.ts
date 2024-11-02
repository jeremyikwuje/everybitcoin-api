import logger from '../../logger/logger';
import APIError from '../../utils/api-error';
import { request_api } from '../api-connector';

export const bitnob_get_usd_price = async (currency = 'NGN') => {
  try {
    const response = await request_api(
      'https://api.bitnob.co/exchange-rates/bitnob',
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get Bitnob USD price. Error: ${response.error}`,
      );
    }

    const data = response.data || [];
    const rate = data.find(
      (value: any) => value.currency === currency,
    );

    if (!rate) {
      throw new Error('Error getting Bitnob rate data');
    }

    return {
      buy: Number(rate.sell_rate),
      sell: Number(rate.buy_rate),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Bitnob price');
    return { buy: 0, sell: 0 };
  }
};
