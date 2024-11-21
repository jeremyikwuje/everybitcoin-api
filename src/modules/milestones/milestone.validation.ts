import { Joi } from 'express-validation';
import { MilestoneType } from './milestone.enums';

export const MilestoneValidation = {
  get_milestones: {
    query: Joi.object({
      page: Joi.number().optional().default(1),
      type: Joi.string().optional().default(MilestoneType.Price),
      start_date: Joi.number().optional(),
      end_date: Joi.number().optional().default(Date.now()),
      price: Joi.number().optional(),
      start_price: Joi.number().optional(),
      end_price: Joi.number().optional(),
      is_future_target: Joi.boolean().optional(),
    }),
  },
  get_milestone: {
    query: Joi.object({
      price: Joi.number().required(),
    }),
  },
  update_milestone: {
    query: Joi.object({
      price: Joi.number().required(),
    }),
    body: Joi.object({
      fields: Joi.object({
        date_achieved: Joi.date().optional(),
        market_cap: Joi.number().optional(),
        days_from_previous: Joi.number().optional(),
        is_future_target: Joi.boolean().optional(),
      }),
    }),
  },
};
