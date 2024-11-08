import { Joi } from 'express-validation';

export const ExchangeValidation = {
  activate_exchange: {
    query: Joi.object({
      code: Joi.string().required().lowercase(),
    }),
  },
  add_exchange: {
    body: Joi.object({
      name: Joi.string().required(),
      code: Joi.string().required().lowercase(),
      icon: Joi.string().required(),
      bio: Joi.string().required(),
      link: Joi.string().required(),
      is_active: Joi.boolean().required(),
    }),
  },
  deactivate_exchange: {
    query: Joi.object({
      code: Joi.string().required().lowercase(),
    }),
  },
  delete_exchange: {
    query: Joi.object({
      code: Joi.string().required().lowercase(),
    }),
  },
  get_exchange: {
    query: Joi.object({
      code: Joi.string().required().lowercase(),
    }),
  },
  update_exchange: {
    query: Joi.object({
      code: Joi.string().required().lowercase(),
    }),
    body: Joi.object({
      fields: Joi.object({
        name: Joi.string().optional(),
        code: Joi.string().optional().lowercase(),
        icon: Joi.number().optional(),
        bio: Joi.string().optional(),
        link: Joi.string().optional(),
        is_active: Joi.boolean().optional(),
        twitter_handle: Joi.string().optional(),
        custody: Joi.array().optional(),
        network_supported: Joi.array().optional(),
        year_launched: Joi.string().optional(),
        year_closed: Joi.string().optional(),
        mobile_os: Joi.array().optional(),
        wallet_key_types: Joi.array().optional(),
        address_format: Joi.array().optional(),
        wallet_access: Joi.array().optional(),
        feature_meta: Joi.object().optional(),
      }).required(),
    }),
  },
};
