import { Joi } from 'express-validation';
import { generate_unique_password } from './auth.service';

export const AuthValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().optional().min(8),
    }),
  },
  register: {
    body: Joi.object({
      email: Joi.string().email().required().lowercase(),
      password: Joi.string().required().min(6).max(20)
        .default(generate_unique_password(16))
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'))
        .messages({
          'string.pattern.base': 'Password must contain at least one number, one lowercase letter, and one uppercase letter.',
        }),
      business_name: Joi.string().optional(),
      country: Joi.string().optional(),
      firstname: Joi.string().optional(),
      lastname: Joi.string().optional(),
      is_investor: Joi.boolean().optional(),
      is_business: Joi.boolean().optional(),
      is_individual: Joi.boolean().optional(),
      meta: Joi.string().optional(),
    }),
  },
  send_verification_code: {
    body: Joi.object({
      email: Joi.string().email().required().lowercase(),
    }),
  },
  change_password: {
    body: Joi.object({
      email: Joi.string().email().required().lowercase(),
      password: Joi.string().required().min(6).max(20)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'))
        .messages({
          'string.pattern.base': 'Password must contain at least one number, one lowercase letter, and one uppercase letter.',
        }),
      password_confirm: Joi.string().required().valid(Joi.ref('password')),
      verify_code: Joi.string().required().min(4).max(100),
    }),
  },
};
