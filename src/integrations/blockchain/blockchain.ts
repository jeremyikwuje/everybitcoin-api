import axios from 'axios';
import logger from '../../logger/logger';
import APIError from '../../utils/api-error';

export const request_blockchain_api = async (
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

export const get_price = async (
  base: string,
  quote: string,
) => {
  const data = await request_blockchain_api(
    `https://blockchain.info/to${base.toLowerCase()}?currency=${quote}&value=1`,
    'GET',
  );

  if (data.error) {
    throw new APIError(
      `Unable to get Bitcoin price to ${quote}`,
    );
  }

  const price = 1 / Number(data || 0);

  return {
    buy: price,
    sell: price,
  };
};

export const BlockchainMethods = {
  get_price,
};
