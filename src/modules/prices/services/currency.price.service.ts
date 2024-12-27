import { PriceMethods } from '../../../integrations/rates/price.methods';
import logger from '../../../logger/logger';
import APIError from '../../../utils/api-error';
import { ErrorType } from '../../../utils/api-response';
import { round_to_decimal_places } from '../../../utils/currency-utils';
import { percentage_difference } from '../../../utils/utilities';
import { CurrencyE } from '../../currencies/currencies.data';
import CurrencyPrices from '../models/currency.prices.model';
import { INewCurrencyPrice, IUpdateCurrencyPrices } from '../price.enums';

export const get_currency_price = async (base: string = CurrencyE.NGN) => {
  const rate = await CurrencyPrices.findOne({
    base,
  });

  if (!rate) {
    throw new APIError(
      'No rates found',
      404,
      ErrorType.NotFound,
    );
  }

  return rate;
};

export const currency_price_found = async (base: string) => {
  const rate = await CurrencyPrices.findOne({
    base,
  });

  return rate;
};

export const get_currency_prices = async () => {
  const rates = await CurrencyPrices.find();
  return rates;
};

export const add_currency_price = async (data: INewCurrencyPrice) => {
  try {
    const rate = new CurrencyPrices(data);
    await rate.save();

    return rate;
  } catch (error: any) {
    throw new APIError(
      error.message || 'Error adding rates',
      500,
      ErrorType.InternalError,
    );
  }
};

export const update_currency_price = async (
  base: string,
  data: IUpdateCurrencyPrices,
) => {
  try {
    const rate = await CurrencyPrices.findOneAndUpdate(
      { base },
      data,
      { new: true },
    );

    if (!rate) {
      throw new APIError(
        'No rates found',
        404,
        ErrorType.NotFound,
      );
    }

    return rate;
  } catch (error: any) {
    throw new APIError(
      error.message || 'Error updating rates',
      500,
      ErrorType.InternalError,
    );
  }
};

export const delete_currency_price = async (base: string) => {
  try {
    const rate = await CurrencyPrices.findOneAndDelete({ base });
    if (!rate) {
      throw new APIError(
        'No rates found',
        404,
        ErrorType.NotFound,
      );
    }

    return rate;
  } catch (error: any) {
    throw new APIError(
      error.message || 'Error deleting rates',
      500,
      ErrorType.InternalError,
    );
  }
};

export const update_currency_prices_from_external_api = async () => {
  try {
    logger.info('Updating BTC rates from external api');

    const currency_prices = await get_currency_prices();

    await Promise.all(currency_prices.map(async (currency_price: any) => {
      const {
        base,
        quotes,
      } = currency_price;

      const bitcoin_price_usd = await PriceMethods.get_bitcoin_price(CurrencyE.USD);
      const latest_prices = await PriceMethods.get_fiat_prices(CurrencyE.USD);

      const updates = Array.from(quotes.entries()).map(async (quote: any) => {
        try {
          const latest_quote_price = latest_prices[quote[0]];
          let quote_price = +latest_quote_price * +bitcoin_price_usd;
          if (base === quote[0]) {
            quote_price = 1;
          } else if (quote[0] === CurrencyE.SAT) {
            quote_price = 100000000;
          }

          const last_quote_price = quote[1] || 0;
          const price_difference = percentage_difference(+last_quote_price, quote_price);
          if (price_difference !== 20) {
            quotes.set(quote[0], round_to_decimal_places(quote_price));
            if (quote[0] === CurrencyE.USD) {
              quotes.set(CurrencyE.USDC, round_to_decimal_places(quote_price));
              quotes.set(CurrencyE.USDT, round_to_decimal_places(quote_price));
            }
          }

          return true;
        } catch (error: any) {
          logger.error(error.message || `Unable to update rate ${quote} in ${base}`);
          return false;
        }
      });

      await Promise.all(updates);

      const data = {
        quotes,
        updated_at: new Date(),
      };

      console.log(data);

      await update_currency_price(base, data);

      return true;
    }));
  } catch (error: any) {
    logger.error(error.message || 'Error updating rates from monierate');
    throw new APIError(
      error.message || 'Error updating rates from monierate',
      500,
      ErrorType.InternalError,
    );
  }
};

export const add_quote_bulk = async () => {
  const currencies = Object.values(CurrencyE);
  const base = CurrencyE.BTC;

  const currency_price: any = await get_currency_price(base);
  const { quotes } = currency_price;

  await Promise.all(currencies.map(async (currency: any) => {
    if (!quotes) {
      return;
    }

    quotes.set(currency.toUpperCase(), 0);
  }));

  const data = {
    quotes,
    updated_at: new Date(),
  };

  await update_currency_price(base, data);
};
