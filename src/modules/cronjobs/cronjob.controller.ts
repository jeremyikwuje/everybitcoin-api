import logger from '../../logger/logger';
import ApiResponse from '../../utils/api-response';
import {
  get_ticker_average_price,
  update_exchange_prices_in_tickers,
  update_ticker,
} from '../tickers/ticker.service';
import {
  add_new_price,
  get_last_day_price,
  get_last_hour_price,
  get_last_month_price,
  get_last_week_price,
  get_recent_price,
} from '../prices/price.service';
import { percentage_difference } from '../../utils/utilities';

export const update_exchange_rates_in_tickers = async (
  req: any,
  res: any,
) => {
  // get all exchanges of btc-usd
  const exchanges = await update_exchange_prices_in_tickers();

  return ApiResponse.success(
    res,
    'Successful',
    exchanges,
  );
};

export const update_prices = async (req: any, res: any) => {
  // get rates from monierate api
  const symbols = ['BTC-USD'];
  const prices = await get_ticker_average_price(symbols);
  console.log(prices);

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

  return ApiResponse.success(
    res,
    'Successful',
    {
      rates,
    },
  );
};

export const update_tickers = async (req: any, res: any) => {
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

  return ApiResponse.success(
    res,
    'Successful',
    {
      rates,
    },
  );
};
