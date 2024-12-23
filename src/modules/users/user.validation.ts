import { Joi } from 'express-validation';
import { Channel } from '../../constants';

export const UserValidation = {
  get_users: {
    query: Joi.object({
      search: Joi.string().optional(),
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
      is_investor: Joi.boolean().optional(),
      is_business: Joi.boolean().optional(),
      is_individual: Joi.boolean().optional(),
      is_active: Joi.boolean().optional(),
      is_admin: Joi.string().optional(),
    }),
  },
  get_user: {
    query: Joi.object({
      id: Joi.string().optional(),
    }),
  },
  update_user: {
    query: Joi.object({
      id: Joi.string().optional(),
    }),
    body: Joi.object({
      firstname: Joi.string().optional(),
      lastname: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      business_name: Joi.string().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postal_code: Joi.string().optional(),
      country: Joi.string().optional(),
      is_investor: Joi.boolean().optional(),
      is_business: Joi.boolean().optional(),
      is_individual: Joi.boolean().optional(),
    }),
  },
  update_user_usage: {
    query: Joi.object({
      id: Joi.string().optional(),
    }),
    body: Joi.object({
      credit_balance: Joi.number().optional().positive().max(10000),
      plan: Joi.string().optional().hex().length(24),
      requests_limit_per_minute: Joi.number().optional().positive(),
    }),
  },
  delete_user: {
    query: Joi.object({
      id: Joi.string().optional(),
    }),
  },
  create_subscription: {
    body: Joi.object({
      plan: Joi.string().required(),
      units: Joi.number().optional().positive().min(1)
        .integer()
        .valid(1, 3, 6, 12)
        .default(1),
      payment_channel: Joi.string().optional().default(Channel.Paystack),
      redirect_url: Joi.string().optional(),
    }),
  },
  initiate_subcription_payment: {
    body: Joi.object({
      subscription_reference: Joi.string().required(),
      payment_channel: Joi.string().optional().default(Channel.Paystack),
      redirect_url: Joi.string().optional(),
    }),
  },
  confirm_subscription: {
    query: Joi.object({
      reference: Joi.string().required(),
    }),
  },
};
