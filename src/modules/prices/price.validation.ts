import { Joi } from 'express-validation';
import { supported_markets } from '../../constants';
import { PriceMarket } from './price.enums';
import { CurrencyE } from '../currencies/currencies.data';

export const PriceValidation = {
  latest: {
    query: Joi.object({
      base: Joi.string().optional().default('BTC').uppercase()
        .valid(...Object.values(CurrencyE)),
      quote: Joi.string().optional().uppercase(),
      market: Joi.string().optional().default(PriceMarket.Parallel).lowercase()
        .valid(...Object.values(PriceMarket)),
      provider: Joi.string().optional(),
    }),
  },
  get_price: {
    query: Joi.object({
      pair: Joi.string().required().lowercase(),
    }),
  },
  get_prices: {
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
  delete_prices: {
    query: Joi.object({
      start_date: Joi.number().required(),
      end_date: Joi.number().required(),
      market: Joi.string().valid(...supported_markets).required(),
      pair: Joi.string().optional().lowercase(),
    }),
  },
  add_base: {
    body: Joi.object({
      base: Joi.string().required().uppercase().valid(...Object.values(CurrencyE)),
      rates: Joi.object().optional(),
    }),
  },
  add_quote: {
    body: Joi.object({
      base: Joi.string().required().uppercase().valid(...Object.values(CurrencyE)),
      quote: Joi.string().required().uppercase().valid(...Object.values(CurrencyE)),
      rate: Joi.number().required(),
    }),
  },
};
