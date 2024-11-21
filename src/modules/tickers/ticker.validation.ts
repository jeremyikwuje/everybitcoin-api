import { Joi } from 'express-validation';
import { ticker_symbols } from './ticker.enums';

export const TickerValidation = {
  activate_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().uppercase(),
    }),
  },
  add_ticker: {
    body: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
    }),
  },
  deactivate_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().uppercase(),
    }),
  },
  delete_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().uppercase(),
    }),
  },
  get_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
      only_price: Joi.boolean().optional().default(false),
    }),
  },
  get_all_tickers: {
    query: Joi.object({
      page: Joi.number().required().default(1),
    }),
  },
  get_ticker_exchanges: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
      exchange_code: Joi.string().optional().lowercase(),
    }),
  },
  update_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
    }),
    body: Joi.object({
      fields: Joi.object({
        symbol: Joi.string().optional().uppercase(),
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
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
    }),
    body: Joi.object({
      exchange_code: Joi.string().required().lowercase(),
      price: Joi.number().optional(),
    }),
  },
  update_exchange_in_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
      exchange_code: Joi.string().required().lowercase(),
    }),
    body: Joi.object({
      fields: Joi.object({
        price: Joi.number().optional(),
        price_sell: Joi.number().optional(),
        price_change: Joi.number().optional(),
        price_change_percent: Joi.number().optional(),
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
      }).required(),
    }),
  },
  remove_exchange_from_ticker: {
    query: Joi.object({
      symbol: Joi.string().required().valid(...ticker_symbols).uppercase(),
      exchange_code: Joi.string().required().lowercase(),
    }),
  },
};
