import { Joi } from 'express-validation';
import { supported_markets } from './price.model';
import { Currency, RateMarket } from '../../constants';

export const RateValidation = {
  get_rate: {
    query: Joi.object({
      pair: Joi.string().required().lowercase(),
    }),
  },
  latest: {
    query: Joi.object({
      base: Joi.string().optional().default(Currency.USD).uppercase(),
      market: Joi.string().optional().default(RateMarket.Mid).lowercase(),
      provider: Joi.string().optional().lowercase(),
    }),
  },
  get_rates: {
    query: Joi.object({
      limit: Joi.number().optional().default(10).positive(),
      page: Joi.number().optional().default(1).positive(),
      csv: Joi.boolean().optional().default(false),
      start_date: Joi.number().optional(),
      end_date: Joi.number().optional().default(Date.now),
      market: Joi.string().valid(...supported_markets).optional(),
      pair: Joi.string().optional().lowercase(),
    }),
  },
  delete_rates: {
    query: Joi.object({
      start_date: Joi.number().required(),
      end_date: Joi.number().required(),
      market: Joi.string().valid(...supported_markets).required(),
      pair: Joi.string().optional().lowercase(),
    }),
  },
};
