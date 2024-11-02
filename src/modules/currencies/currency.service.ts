import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Currency from './currency.model';
import logger from '../../logger/logger';
import { get_ticker } from '../tickers/ticker.service';
import Money from '../../utils/money';
import { Currencies } from '../../constants';

interface currencyDTO {
  code?: string;
  is_active?: boolean;
  symbol?: string;
  name?: string;
  description?: string;
  icon?: string;
}

export const convert_currency = async (
  from: string,
  to: string,
  amount: number,
) => {
  const from_currency = from.toUpperCase();
  const to_currency = to.toUpperCase();

  let conversion = 0;
  let ticker = null;

  try {
    const ticker_symbol = `${from_currency}-${to_currency}`;
    ticker = await get_ticker(ticker_symbol);
    conversion = Number(amount) * Number(ticker.price);
  } catch (error: any) {
    try {
      const ticker_symbol = `${to_currency}-${from_currency}`;
      ticker = await get_ticker(ticker_symbol);
      conversion = Number(amount) / Number(ticker.price);
    } catch (err: any) {
      logger.error(err.message || 'Unable to convert currency');

      throw new APIError(
        'No ticker found',
        NOT_FOUND,
      );
    }
  }

  conversion = Money.format_currency_amount(
    conversion,
    to_currency,
  );
  const [
    base,
    quote,
  ] = ticker.symbol.split('-');

  return {
    from,
    to,
    amount,
    result: {
      currency: {
        value: conversion,
        unit: to_currency,
      },
      denomination: {
        value: Money.to_denomination(conversion, to_currency),
        unit: Currencies.find(
          (c) => c.code === to_currency,
        )?.denomination_short || '',
      },
      ticker: {
        symbol: ticker.symbol,
        price: {
          value: Money.format_currency_amount(
            Number(ticker.price),
            quote,
          ),
          unit: quote,
        },
        inverse_price: {
          value: Money.format_currency_amount(
            1 / Number(ticker.price),
            base,
          ),
          unit: base,
          denomination: {
            value: Money.to_denomination(
              1 / Number(ticker.price),
              base,
            ),
            unit: Currencies.find(
              (c) => c.code === base,
            )?.denomination_short || '',
          },
        },
      },
    },
  };
};

export const get_currency = async (code: string) => {
  // get currency from database
  const currency = await Currency.findOne({
    code,
  });

  if (!currency) {
    throw new APIError(
      'No currency found',
      NOT_FOUND,
    );
  }

  return currency;
};

export const add_new_currency = async (currency: currencyDTO) => {
  const existing_currency = await Currency.findOne({ code: currency.code });
  if (existing_currency) {
    throw new APIError(
      'currency already exists',
      CONFLICT,
    );
  }

  // add new currency to database
  const new_currency = await Currency.create(currency);

  if (!new_currency) {
    throw new APIError(
      'Unable to create new currency',
      CONFLICT,
    );
  }

  return new_currency;
};

export const update_currency = async (code: string, entry: currencyDTO) => {
  const currency = await get_currency(code);
  if (!currency) {
    throw new APIError(
      'No currency found',
      NOT_FOUND,
    );
  }

  // add new currency to database
  const updated_currency = await Currency.updateOne({
    code,
  }, entry, { upsert: true, new: true });

  if (!updated_currency) {
    throw new APIError(
      'Unable to update currency',
      NOT_MODIFIED,
    );
  }

  return currency;
};

export const get_currencies = async (currency_codes: [], is_active: boolean) => {
  try {
    // get currencies from database
    const currencies = await Currency.find({
      code: { $in: currency_codes },
      is_active,
    });

    return currencies;
  } catch (error: any) {
    logger.error(error);
    throw new APIError(
      'No currencies found',
      NOT_FOUND,
    );
  }
};

export const get_all_currencies = async () => {
  try {
    // get currencies from database
    const currencies = await Currency.find({});

    return currencies;
  } catch (error: any) {
    logger.error(error);

    throw new APIError(
      'No currencies found',
      NOT_FOUND,
    );
  }
};

export const delete_currency = async (code: string) => {
  // delete currency from database
  const currency = await Currency.findOneAndDelete({
    code,
    is_active: false,
  });

  if (!currency) {
    return false;
  }

  return currency;
};

export const delete_currencies = async (currency_codes: []) => {
  // delete all currencies from database
  const currencies = await Currency.deleteMany({
    code: { $in: currency_codes },
    is_active: false,
  });

  if (!currencies) {
    return null;
  }

  return currencies;
};

export const activate_currency = async (code: string) => {
  // activate currency from database
  const currency = update_currency(code, { is_active: true });
  return currency;
};

export const activate_currencies = async (currency_codes: []) => {
  // activate all currencies from database
  const currencies = await Currency.updateMany({
    code: { $in: currency_codes },
  }, { is_active: true });

  if (!currencies) {
    throw new APIError(
      'Unable to activate currencies',
      NOT_MODIFIED,
    );
  }

  return currencies;
};

export const deactivate_currency = async (code: string) => {
  const currency = update_currency(code, { is_active: false });
  return currency;
};

export const deactivate_currencies = async (currency_codes: []) => {
  // deactivate all currencies from database
  const currencies = await Currency.updateMany({
    code: { $in: currency_codes },
  }, { is_active: false });

  if (!currencies) {
    throw new APIError(
      'Unable to deactivate currencies',
      NOT_MODIFIED,
    );
  }

  return currencies;
};
