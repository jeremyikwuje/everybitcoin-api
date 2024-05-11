import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Ticker from './ticker.model';
import logger from '../../logger/logger';

interface tickerDTO {
  symbol?: string;
  is_active?: boolean;
  exchanges?: object;
  price?: number;
  price_change?: number;
  price_change_percent?: number;
  price_change_30min?: number;
  price_change_percent_30min?: number;
  price_change_1hr?: number;
  price_change_percent_1hr?: number;
  price_change_24hr?: number;
  price_change_percent_24hr?: number;
  price_change_7d?: number;
  price_change_percent_7d?: number;
  price_change_30d?: number;
  price_change_percent_30d?: number;
  price_change_60d?: number;
  price_change_percent_60d?: number;
  price_change_90d?: number;
  price_change_percent_90d?: number;
  price_change_180d?: number;
  price_change_percent_180d?: number;
  price_change_1yr?: number;
  price_change_percent_1yr?: number;
  price_change_2yr?: number;
  price_change_percent_2yr?: number;
  price_change_3yr?: number;
  price_change_percent_3yr?: number;
  price_change_5yr?: number;
  price_change_percent_5yr?: number;
  price_change_10yr?: number;
  price_change_percent_10yr?: number;
}

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

export const get_tickers = async (ticker_symbols: [], is_active: boolean) => {
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

export const update_ticker = async (symbol: string, entry: tickerDTO) => {
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
}

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
