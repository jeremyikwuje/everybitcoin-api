import { Joi } from 'express-validation';
import { currency_codes } from './currency.model';

export const CurrencyValidation = {
  activate_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...currency_codes),
    }),
  },
  add_currency: {
    body: Joi.object({
      code: Joi.string().required().valid(...currency_codes),
      name: Joi.string().required(),
      symbol: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
  deactivate_currency: {
    query: Joi.object({
      code: Joi.string().required(),
    }),
  },
  delete_currency: {
    query: Joi.object({
      code: Joi.string().required(),
    }),
  },
  get_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...currency_codes),
    }),
  },
  update_currency: {
    query: Joi.object({
      code: Joi.string().required().valid(...currency_codes),
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
};
