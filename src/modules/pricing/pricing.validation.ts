import { Joi } from 'express-validation';
import { BillingCycle } from './pricing.enums';

export const PricingValidation = {
  get_all_pricing: {
    query: Joi.object({
      is_active: Joi.string().optional().default('true'),
    }),
  },
  get_pricing: {
    query: Joi.object({
      id: Joi.string().required(),
    }),
  },
  create_pricing: {
    body: Joi.object({
      name: Joi.string().optional(),
      code: Joi.string().optional(),
      price: Joi.number().optional(),
      billing_cycle: Joi.string().optional()
        .valid(...Object.values(BillingCycle))
        .default(BillingCycle.Monthly),
      requests_limit_per_month: Joi.number().optional(),
      requests_limit_per_minute: Joi.number().optional(),
      is_active: Joi.boolean().optional(),
    }),
  },
  update_pricing: {
    query: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().optional(),
      code: Joi.string().optional(),
      price: Joi.number().optional(),
      billing_cycle: Joi.string().optional()
        .valid(...Object.values(BillingCycle)),
      requests_limit_per_month: Joi.number().optional(),
      requests_limit_per_minute: Joi.number().optional(),
      is_active: Joi.boolean().optional(),
    }),
  },
  delete_pricing: {
    query: Joi.object({
      id: Joi.string().optional(),
    }),
  },
};
