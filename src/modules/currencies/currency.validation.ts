import { Joi } from 'express-validation';
import { currency_codes } from './currency.model';

export const CurrencyValidation = {
  activate_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...currency_codes).uppercase(),
    }),
  },
  add_currency: {
    body: Joi.object({
      code: Joi.string().required().valid(...currency_codes).uppercase(),
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
      code: Joi.string().required().valid(...currency_codes).uppercase(),
    }),
  },
  update_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...currency_codes).uppercase(),
    }),
    body: Joi.object({
      fields: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),        
        symbol: Joi.string().optional(),
        icon: Joi.string().optional()
      }).required(),
    }),
  },
  convert_currency: {
    body: Joi.object({
      from: Joi.string().required().valid(...currency_codes).uppercase(),
      to: Joi.string().required().valid(...currency_codes).uppercase(),
      amount: Joi.number().required().positive().greater(0),
    }),
  },
};
