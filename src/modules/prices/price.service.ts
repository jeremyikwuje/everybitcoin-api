import { CONFLICT, NOT_FOUND } from 'http-status';
import { subDays, subHours, subMonths } from 'date-fns';
import APIError from '../../utils/api-error';
import Price from './price.model';
import logger from '../../logger/logger';

interface priceDTO {
  ticker?: string;
  price?: boolean;
  market?: string;
}

export const add_new_price = async (rate: priceDTO) => {
  // add new currency to database
  const new_price = await Price.create(rate);

  if (!new_price) {
    throw new APIError(
      'Unable to create new rate',
      CONFLICT,
    );
  }

  return new_price;
};

export const get_prices_by_market = async (market: string) => {
  // get currency from database
  const prices = await Price.findOne({
    market,
  });

  if (!prices) {
    throw new APIError(
      'No prices found',
      NOT_FOUND,
    );
  }

  return prices;
};

export const get_prices_by_ticker = async (ticker: string) => {
  // get currency from database
  const prices = await Price.findOne({
    ticker,
  });

  if (!prices) {
    throw new APIError(
      'No prices found',
      NOT_FOUND,
    );
  }

  return prices;
};

export const get_recent_price = async (
  ticker: string,
  exchange: string = 'host',
) => {
  const match: any = {
    ticker,
    exchange,
  };

  const prices = await Price.find(match).sort('-createdAt').limit(1).select('-_id -__v');

  if (prices.length === 0) {
    return 0;
  }

  return prices[0].price || 0;
};

export const get_last_hour_price = async (
  ticker: string,
  exchange: string = 'host',
) => {
  const match: any = {
    ticker,
    exchange,
    createdAt: { $gte: subHours(new Date(), 1) },
  };

  const prices = await Price.find(match)
    .sort('createdAt')
    .limit(1).select('-_id -__v');
  if (prices.length === 0) {
    return 0;
  }

  return prices[0].price || 0;
};

export const get_last_day_price = async (
  ticker: string,
  exchange: string = 'host',
) => {
  const match: any = {
    ticker,
    exchange,
    createdAt: { $gte: subDays(new Date(), 1) },
  };

  const prices = await Price.find(match)
    .sort('createdAt')
    .limit(1).select('-_id -__v');
  if (prices.length === 0) {
    return 0;
  }

  return prices[0].price || 0;
};

export const get_last_week_price = async (
  ticker: string,
  exchange: string = 'host',
) => {
  const match: any = {
    ticker,
    exchange,
    createdAt: { $gte: subDays(new Date(), 7) },
  };

  const prices = await Price.find(match)
    .sort('createdAt')
    .limit(1).select('-_id -__v');
  if (prices.length === 0) {
    return 0;
  }

  return prices[0].price || 0;
};

export const get_last_month_price = async (
  ticker: string,
  exchange: string = 'host',
) => {
  const match: any = {
    ticker,
    exchange,
    createdAt: { $gte: subMonths(new Date(), 1) },
  };

  const prices = await Price.find(match)
    .sort('createdAt')
    .limit(1).select('-_id -__v');
  if (prices.length === 0) {
    return 0;
  }

  return prices[0].price || 0;
};

export const get_all_prices = async () => {
  try {
    // get currencies from database
    const prices = await Price.find({});

    return prices;
  } catch (error: any) {
    logger.error(error);

    throw new APIError(
      'No prices found',
      NOT_FOUND,
    );
  }
};

export const delete_price_by_market = async (market: string) => {
  // delete currency from database
  const delete_prices = await Price.deleteMany({
    market,
  });

  if (!delete_prices) {
    return false;
  }

  return delete_prices;
};

export const delete_price_by_ticker = async (ticker: string) => {
  // delete currency from database
  const delete_prices = await Price.deleteMany({
    ticker,
  });

  if (!delete_prices) {
    return false;
  }

  return delete_prices;
};
