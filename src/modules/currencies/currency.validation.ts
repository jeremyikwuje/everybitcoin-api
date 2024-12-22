import { Joi } from 'express-validation';
import { CurrencyE } from './currencies.data';

export const CurrencyValidation = {
  activate_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
    }),
  },
  add_currency: {
    body: Joi.object({
      code: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
      name: Joi.string().required(),
      symbol: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
  deactivate_currency: {
    query: Joi.object({
      code: Joi.string().required().uppercase(),
    }),
  },
  delete_currency: {
    query: Joi.object({
      code: Joi.string().required().uppercase(),
    }),
  },
  get_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
    }),
  },
  update_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
    }),
    body: Joi.object({
      fields: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        symbol: Joi.string().optional(),
        icon: Joi.string().optional(),
      }).required(),
    }),
  },
  convert_currency: {
    body: Joi.object({
      from: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
      to: Joi.string().required().valid(...Object.values(CurrencyE)).uppercase(),
      amount: Joi.number().required().positive().greater(0),
    }),
  },
};
