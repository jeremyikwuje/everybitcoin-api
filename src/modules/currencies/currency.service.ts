import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Currency from './currency.model';
import logger from '../../logger/logger';

interface currencyDTO {
  code?: string;
  is_active?: boolean;
  symbol?: string;
  name?: string;
  description?: string;
  icon?: string;
}

export const add_new_currency = async (currency: currencyDTO) => {
  const get_currency = await Currency.findOne({ code: currency.code });
  if (get_currency) {
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

export const activate_currency = async (code: string) =>

// activate currency from database
  update_currency(code, { is_active: true });

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

export const deactivate_currency = async (code: string) => update_currency(code, { is_active: false });

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
