import { Joi } from 'express-validation';
import { ticker_symbols } from './ticker.model';

export const TickerValidation = {
  activate_ticker: {
    query: Joi.object({
      symbol: Joi.string().required(),
    }),
  },
  add_ticker: {
    body: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols),
    }),
  },
  deactivate_ticker: {
    query: Joi.object({
      symbol: Joi.string().required(),
    }),
  },
  delete_ticker: {
    query: Joi.object({
      symbol: Joi.string().required(),
    }),
  },
  get_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols),
    }),
  },
  get_all_tickers: {
    query: Joi.object({
      page: Joi.number().required().default(1),
    }),
  },
  get_ticker_exchanges: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols),
      exchange_code: Joi.string().optional(),
    }),
  },
  update_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols),
    }),
    body: Joi.object({
      fields: Joi.object({
        symbol: Joi.string().optional(),
        is_active: Joi.boolean().optional(),
        exchanges: Joi.object().optional(),
        price: Joi.number().optional(),
        price_change: Joi.number().optional(),
        price_change_percent: Joi.number().optional(),
        price_change_30min: Joi.number().optional(),
        price_change_percent_30min: Joi.number().optional(),
        price_change_1hr: Joi.number().optional(),
        price_change_percent_1hr: Joi.number().optional(),
        price_change_24hr: Joi.number().optional(),
        price_change_percent_24hr: Joi.number().optional(),
        price_change_7d: Joi.number().optional(),
        price_change_percent_7d: Joi.number().optional(),
        price_change_30d: Joi.number().optional(),
        price_change_percent_30d: Joi.number().optional(),
        price_change_60d: Joi.number().optional(),
        price_change_percent_60d: Joi.number().optional(),
        price_change_90d: Joi.number().optional(),
        price_change_percent_90d: Joi.number().optional(),
        price_change_180d: Joi.number().optional(),
        price_change_percent_180d: Joi.number().optional(),
        price_change_1yr: Joi.number().optional(),
        price_change_percent_1yr: Joi.number().optional(),
        price_change_2yr: Joi.number().optional(),
        price_change_percent_2yr: Joi.number().optional(),
        price_change_3yr: Joi.number().optional(),
        price_change_percent_3yr: Joi.number().optional(),
        price_change_5yr: Joi.number().optional(),
        price_change_percent_5yr: Joi.number().optional(),
        price_change_10yr: Joi.number().optional(),
        price_change_percent_10yr: Joi.number().optional(),
      }).required(),
    }),
  },
  add_exchange_to_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols),
    }),
    body: Joi.object({
      code: Joi.string().required(),
      price: Joi.number().optional(),
    }),
  },
};
