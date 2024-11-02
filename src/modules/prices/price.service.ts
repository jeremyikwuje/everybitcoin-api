import { CONFLICT, NOT_FOUND } from 'http-status';
import { subDays, subHours, subMonths } from 'date-fns';
import APIError from '../../utils/api-error';
import Price from './price.model';
import logger from '../../logger/logger';
import { get_ticker_average_price, update_ticker } from '../tickers/ticker.service';
import { percentage_difference } from '../../utils/utilities';

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

export const save_prices_from_tickers = async () => {
  // get rates from monierate api
  const symbols = ['BTC-USD'];
  const prices = await get_ticker_average_price(symbols);

  const rates: any = [];
  await Promise.all(symbols.map(async (symbol) => {
    const price = prices[symbol];

    try {
      // insert new rate to rates collection
      const add_price = await add_new_price({
        ticker: symbol,
        price: price.average,
        market: 'exchanges',
      });

      rates.push(add_price);
    } catch (error: any) {
      logger.info(`Unable to add price for ${symbol} to database: ${error.message}`);
    }
  }));

  return rates;
};

export const update_prices_on_tickers = async () => {
  const symbols = ['BTC-USD'];

  const rates: any = [];
  await Promise.all(symbols.map(async (symbol) => {
    // get most recent rate
    const price = await get_recent_price(symbol);
    const price_1hr = await get_last_hour_price(symbol);
    const price_24hr = await get_last_day_price(symbol);
    const price_7d = await get_last_week_price(symbol);
    const price_30d = await get_last_month_price(symbol);

    const price_change_percent_1hr = percentage_difference(price, price_1hr);
    const price_change_percent_24hr = percentage_difference(price, price_24hr);
    const price_change_percent_7d = percentage_difference(price, price_7d);
    const price_change_percent_30d = percentage_difference(price, price_30d);

    try {
      await update_ticker(symbol, {
        price,
        price_1hr,
        price_24hr,
        price_7d,
        price_30d,

        price_change_percent_1hr,
        price_change_percent_24hr,
        price_change_percent_7d,
        price_change_percent_30d,
      });

      rates.push({
        symbol,
        price,
        price_1hr,
        price_24hr,
        price_7d,
        price_30d,

        price_change_percent_1hr,
        price_change_percent_24hr,
        price_change_percent_7d,
        price_change_percent_30d,
      });
    } catch (error: any) {
      logger.error(error.message || `Unable to update ${symbol} ticker`);
    }
  }));
};
