import { BAD_REQUEST } from 'http-status';
import axios from 'axios';
import APIError from '../../utils/api-error';
import logger from '../../logger/logger';

const BYBIT_API_URL = 'https://api.bybit.com';

type ORDER_TYPE = 'spot';

export const request_bybit_api = async (
  url: string,
  method: string,
  data: object = {},
) => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });

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

export const get_ticker_data = async (
  ticker_symbol: string,
  order: ORDER_TYPE = 'spot',
) => {
  logger.info(`Getting ticker data for ${ticker_symbol} on ${order}`);

  const splice_ticker = ticker_symbol.split('-');
  const symbol = splice_ticker.length > 1 ? `${splice_ticker[0]}${splice_ticker[1]}` : ticker_symbol;

  const endpoint = `${BYBIT_API_URL}/spot/v3/public/quote/ticker/24hr?&symbol=${symbol}`;
  const ticker_data = await request_bybit_api(
    endpoint,
    'GET',
  );

  if (ticker_data.error) {
    throw new APIError(
      ticker_data.error.message || 'Unable to retrieve price data',
      BAD_REQUEST,
    );
  }

  const result = ticker_data.result || {};
  return result[0];
};

export const get_price = async (ticker_symbol: string) => {
  const data = await get_ticker_data(ticker_symbol, 'spot');

  return {
    buy: data.ap || data.lp,
    sell: data.bp || data.lp,
  };
};

export const BybitMethods = {
  get_ticker_data,
  get_price,
};
