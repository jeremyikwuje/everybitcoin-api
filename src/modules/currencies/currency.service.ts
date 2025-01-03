import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Currency from './currency.model';
import logger from '../../logger/logger';
import { get_ticker } from '../tickers/ticker.service';
import Money from '../../utils/money';
import { Currencies } from '../../constants';
import { CurrenciesE } from './currencies.data';
import { ErrorType } from '../../utils/api-response';

interface currencyDTO {
  code?: string;
  is_active?: boolean;
  symbol?: string;
  name?: string;
  description?: string;
  icon?: string;
  decimals?: number;
  denomination?: any;
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
  const ticker_price = Money.format_currency_amount(
    Number(ticker.price),
    quote,
  );
  const ticker_inverse_price = Money.format_currency_amount(
    1 / Number(ticker.price),
    base,
  );

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
          value: ticker_price,
          unit: quote,
        },
        inverse_price: {
          value: ticker_inverse_price,
          unit: base,
          denomination: {
            value: Money.to_denomination(
              ticker_inverse_price,
              base,
            ),
            unit: Currencies.find(
              (c) => c.code === base,
            )?.denomination_short || '',
          },
        },
        last_updated: ticker.updatedAt,
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
  try {
    const existing_currency = await Currency.findOne({ code: currency.code });
    if (existing_currency) {
      throw new APIError(
        'currency already exists',
        CONFLICT,
        ErrorType.Duplicate,
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
  } catch (error: any) {
    logger.error(error);
    throw new APIError(
      `Unable to create new currency: ${error.message}`,
      error.statusCode || 500,
      error.errorType || ErrorType.InternalError,
    );
  }
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

export const add_currency_bulk = async () => {
  logger.info('Adding currencies');
  const currencies = Object.values(CurrenciesE);

  const add_currencies = currencies.map(async (currency) => {
    try {
      await add_new_currency({
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
        description: currency.description,
        icon: currency.icon_code,
        decimals: currency.decimals,
        denomination: currency.denomination,
        is_active: true,
      });

      return true;
    } catch (error: any) {
      return false;
    }
  });

  const c = await Promise.all(add_currencies);

  return c;
};
