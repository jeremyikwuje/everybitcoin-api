import { CONFLICT, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import APIError from '../../utils/api-error';
import Exchange from './exchange.model';

interface exchangeDTO {
  name?: string;
  code?: object;
  icon?: number;
  bio?: number;
  link?: number;
  is_active?: boolean;
}

export const get_exchange = async (code: string) => {
  // get exchange from database
  const exchange = await Exchange.findOne({
    code: code.toLowerCase(),
  });

  if (!exchange) {
    throw new APIError(
      'No exchange found',
      NOT_FOUND,
    );
  }

  return exchange;
};

export const get_exchanges = async (supported_exchanges: [], is_active: boolean) => {
  // get exchanges from database
  const exchanges = await Exchange.find({
    code: { $in: supported_exchanges },
    is_active,
  });

  return exchanges;
};

export const get_all_exchanges = async () => {
  // get exchanges from database
  const exchanges = await Exchange.find({});

  return exchanges;
};

export const add_new_exchange = async (entry: exchangeDTO) => {
  // add new exchange to database
  const exchange = await Exchange.create(entry);

  if (!exchange) {
    throw new APIError(
      'Unable to add exchange',
      CONFLICT,
    );
  }

  return exchange;
};

export const update_exchange = async (code: string, entry: exchangeDTO) => {
  // add new exchange to database
  const exchange = await Exchange.findOneAndUpdate({
    code,
  }, entry, { upsert: true, new: true });

  if (!exchange) {
    throw new APIError(
      'Unable to update exchange',
      NOT_MODIFIED,
    );
  }

  return exchange;
};

export const delete_exchange = async (code: string) => {
  // delete exchange from database
  const exchange = await Exchange.deleteOne({
    code,
    is_active: false,
  });

  if (!exchange.deletedCount) {
    return null;
  }

  return exchange;
};

export const delete_exchanges = async (supported_exchanges: []) => {
  // delete all exchanges from database
  const exchanges = await Exchange.deleteMany({
    code: { $in: supported_exchanges },
    is_active: false,
  });

  if (!exchanges) {
    return false;
  }

  return exchanges;
};

export const activate_exchange = async (code: string) => {
  const exchange = update_exchange(code, { is_active: true });
  return exchange;
};

export const activate_exchanges = async (supported_exchanges: []) => {
  // activate all exchanges from database
  const exchanges = await Exchange.updateMany({
    code: { $in: supported_exchanges },
  }, { is_active: true });

  if (!exchanges) {
    throw new APIError(
      'Unable to activate exchanges',
      NOT_MODIFIED,
    );
  }

  return exchanges;
};

export const deactivate_exchange = async (code: string) => {
  const exchange = update_exchange(code, { is_active: false });
  return exchange;
};

export const deactivate_exchanges = async (supported_exchanges: []) => {
  // deactivate all exchanges from database
  const exchanges = await Exchange.updateMany({
    code: { $in: supported_exchanges },
  }, { is_active: false });

  if (!exchanges) {
    throw new APIError(
      'Unable to deactivate exchanges',
      NOT_MODIFIED,
    );
  }

  return exchanges;
};
