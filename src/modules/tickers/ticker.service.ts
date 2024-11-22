import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Ticker from './ticker.model';
import logger from '../../logger/logger';
import { tickerDTO, tickerExchangeDTO } from './ticker.enums';
import Time from '../../utils/time';
import { get_exchange_rate } from '../../integrations/rates/changer.method';
import Config from '../../config/config';

export const add_new_ticker = async (symbol: string) => {
  const ticker = await Ticker.findOne({ symbol });
  if (ticker) {
    throw new APIError(
      'Ticker already exists',
      CONFLICT,
    );
  }

  // add new ticker to database
  const new_ticker = await Ticker.create({
    symbol,
  });

  if (!new_ticker) {
    throw new APIError(
      'Unable to create new ticker',
      CONFLICT,
    );
  }

  return new_ticker;
};

export const get_ticker = async (symbol: string) => {
  // get ticker from database
  const ticker = await Ticker.findOne({
    symbol,
  });

  if (!ticker) {
    throw new APIError(
      'No ticker found',
      NOT_FOUND,
    );
  }

  return ticker;
};

export const get_tickers = async (
  ticker_symbols: string[],
  is_active: boolean,
) => {
  try {
    // get tickers from database
    const tickers = await Ticker.find({
      symbol: { $in: ticker_symbols },
      is_active,
    });

    return tickers;
  } catch (error: any) {
    logger.error(error);
    throw new APIError(
      'No tickers found',
      NOT_FOUND,
    );
  }
};

export const get_all_tickers = async (limit: number = 30) => {
  try {
    // get tickers from database
    const tickers = await Ticker.find({}).limit(limit);

    return tickers;
  } catch (error: any) {
    logger.error(error);

    throw new APIError(
      'No tickers found',
      NOT_FOUND,
    );
  }
};

export const update_ticker = async (
  symbol: string,
  entry: tickerDTO,
) => {
  const ticker = await get_ticker(symbol);
  if (!ticker) {
    throw new APIError(
      'No ticker found',
      NOT_FOUND,
    );
  }

  // add new ticker to database
  const updated_ticker = await Ticker.findOneAndUpdate({
    symbol,
  }, entry, { upsert: true, new: true });

  if (!updated_ticker) {
    throw new APIError(
      'Unable to update ticker',
      NOT_MODIFIED,
    );
  }

  return updated_ticker;
};

export const delete_ticker = async (symbol: string) => {
  // delete ticker from database
  const ticker = await Ticker.deleteOne({
    symbol,
    is_active: false,
  });

  if (!ticker) {
    return false;
  }

  return ticker;
};

export const delete_tickers = async (ticker_symbols: []) => {
  // delete all tickers from database
  const tickers = await Ticker.deleteMany({
    symbol: { $in: ticker_symbols },
    is_active: false,
  });

  if (!tickers) {
    return null;
  }

  return tickers;
};

export const activate_ticker = async (symbol: string) => {
  // activate ticker from database
  const ticker = update_ticker(symbol, { is_active: true });
  return ticker;
};

export const activate_tickers = async (ticker_symbols: []) => {
  // activate all tickers from database
  const tickers = await Ticker.updateMany({
    symbol: { $in: ticker_symbols },
  }, { is_active: true });

  if (!tickers) {
    throw new APIError(
      'Unable to activate tickers',
      NOT_MODIFIED,
    );
  }

  return tickers;
};

export const deactivate_ticker = async (symbol: string) => {
  const ticker = update_ticker(symbol, { is_active: false });
  return ticker;
};

export const deactivate_tickers = async (ticker_symbols: []) => {
  // deactivate all tickers from database
  const tickers = await Ticker.updateMany({
    symbol: { $in: ticker_symbols },
  }, { is_active: false });

  if (!tickers) {
    throw new APIError(
      'Unable to deactivate tickers',
      NOT_MODIFIED,
    );
  }

  return tickers;
};

export const update_ticker_exchange_props = (
  exchanges: any,
  exchange_code: string,
  entry: tickerExchangeDTO,
) => {
  const exchange_index = exchanges.findIndex(
    (ex: any) => ex.code === exchange_code,
  );

  const updated_exchanges: any = exchanges;
  if (exchange_index !== -1) {
    const exchange_to_update: any = updated_exchanges[exchange_index].toObject();

    const entry_obj: any = entry;
    Object.keys(entry_obj).forEach((key) => {
      exchange_to_update[key] = entry_obj[key];
    });

    updated_exchanges[exchange_index] = exchange_to_update;
  }

  return updated_exchanges;
};

export const update_ticker_exchange = async (
  code: string,
  exchange_code: string,
  entry: tickerExchangeDTO,
) => {
  const ticker = await get_ticker(code);
  if (!ticker) {
    throw new APIError(
      'No pair found',
      NOT_FOUND,
    );
  }

  const { exchanges } = ticker;
  const exchange_index = exchanges.findIndex(
    (ex: any) => ex.code === exchange_code,
  );

  const updated_exchanges: any = exchanges;
  if (exchange_index !== -1) {
    const exchange_to_update: any = exchanges[exchange_index].toObject();

    const entry_obj: any = entry;
    Object.keys(entry_obj).forEach((key) => {
      exchange_to_update[key] = entry_obj[key];
    });

    updated_exchanges[exchange_index] = exchange_to_update;
  }

  const updated_pair = await Ticker.findOneAndUpdate({
    code,
  }, {
    exchanges: updated_exchanges,
  }, { new: true });

  logger.info(`${code} ${exchange_code} ${entry.price_sell}`);

  if (!updated_pair) {
    throw new APIError(
      'Unable to update pair',
      NOT_MODIFIED,
    );
  }

  return updated_exchanges[exchange_index];
};

export const calculate_averate_price_of_exchanges = async (
  exchanges: any,
) => {
  let total = 0;
  let count = 0;

  await Promise.all(exchanges.map(async (exchange: any) => {
    // if exchange not a trusted exchange
    const { trusted_exchanges } = Config;
    if (!trusted_exchanges.includes(exchange.code)) {
      return;
    }

    if (exchange.price_buy > 0 || exchange.price_sell > 0) {
      console.log(exchange.price_buy, exchange.code);
      total += exchange.price_buy || exchange.price_sell;
      count += 1;
    }
  }));

  return total / count;
};

export const get_ticker_average_price = async (
  ticker_symbols: string[],
) => {
  // get all pairs
  const pairs = await get_tickers(ticker_symbols, true);

  const result: any = {};

  await Promise.all(pairs.map(async (ticker) => {
    const { exchanges } = ticker;

    let average = await calculate_averate_price_of_exchanges(exchanges);
    console.log(average);

    if (average <= 0) {
      // get the market changer rate
      const market = exchanges.find(
        (exchange) => exchange.code === 'market',
      );

      if (!market) {
        average = 0;
      } else {
        average = market.price_buy || market.price_sell || 0;
      }
    }

    result[ticker.symbol] = {
      symbol: ticker.symbol,
      average,
      updated_at: ticker.updatedAt,
    };
  }));

  return result;
};

export const update_exchange_prices_in_tickers = async () => {
  // get all exchanges of btc-usd
  const symbols = ['BTC-USD'];

  const exchanges_updated: any = [];
  const iterate_symbols = symbols.map(async (symbol) => {
    const split_symbol = symbol.split('-');
    const base = split_symbol[0];
    const quote = split_symbol[1];

    try {
      const ticker = await get_ticker(symbol);
      const { exchanges } = ticker;

      let updated_exchanges: any = exchanges;
      const promise = exchanges.map(async (exchange: any) => {
        try {
          const { code: exchange_code } = exchange;
          const {
            buy,
            sell,
          } = await get_exchange_rate(
            exchange_code,
            base,
            quote,
          ); // Assuming get_exchange_rates is a function that fetches rates

          logger.info(`Updating ${exchange_code} ${symbol} rate: ${buy} buy | ${sell} sell`);

          if (buy > 0 || sell > 0) {
            const updated_properties = {
              code: exchange_code,
              price_buy: buy,
              price_sell: sell,
              updated_at: new Date(Time.now()),
            };

            updated_exchanges = update_ticker_exchange_props(
              exchanges,
              exchange_code,
              updated_properties,
            );

            exchanges_updated.push(updated_properties);
          }

          return true;
        } catch (error: any) {
          logger.error(
            error.message
                || `Unable to get exchange rate: ${exchange.code}`,
          );

          return exchange;
        }
      });

      await Promise.all(promise);
      await update_ticker(symbol, { exchanges: updated_exchanges });

      return true;
    } catch (error) {
      logger.error(`Error processing pair code ${symbol}:`, error);
      return false;
    }
  });

  await Promise.all(iterate_symbols);

  return exchanges_updated;
};
