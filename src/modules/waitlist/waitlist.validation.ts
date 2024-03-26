import { Joi } from 'express-validation';

export const WaitlistValidation = {
  addMember: {
    body: Joi.object({
      email: Joi.string().email().required(),
      ip: Joi.string().optional().default('1.1.1.1'),
      device: Joi.string().optional().default('unknown'),
      country: Joi.string().optional().default('unknown'),
    }),
  },
};
