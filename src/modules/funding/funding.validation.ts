import { Joi } from 'express-validation';
import { FundingType, IFundingType } from './funding.enums';

const FundingTypeKeys: (keyof IFundingType)[] = [
  'name',
  'title',
  'about',
  'is_repayable',
];

const FundingTypeObject = FundingTypeKeys.reduce((acc, key) => {
  acc[key] = Joi.any(); // or specify the type of validation you need
  return acc;
}, {} as Record<keyof IFundingType, any>);

export const FundingValidation = {
  get_funding_rounds: {
    query: Joi.object({
      search: Joi.string().optional(),
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
      changer: Joi.string().optional(),
      equity_type: Joi.string().optional(),
      investors: Joi.string().optional(),
      round: Joi.string().optional(),
      return_rate: Joi.number().optional(),
    }),
  },
  get_funding_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
  },
  create_funding_round: {
    body: Joi.object({
      amount: Joi.number().required(),
      currency: Joi.string().optional().default('USD'),
      changer: Joi.string().required(),
      types: Joi.array().items(Joi.object({
        funding_type: Joi.string().required().valid(...Object.values(FundingType)),
      })).optional(),
      message: Joi.string().optional(),
      special_message: Joi.string().optional(),
      round: Joi.string().optional(),
      return_rate: Joi.number().optional(),
      data_sources: Joi.array().items(Joi.object({
        source_id: Joi.string().required(),
      })).optional(),
      repayment_period: Joi.string().optional(),
    }),
  },
  update_funding_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
    body: Joi.object({
      amount: Joi.number().optional(),
      changer_id: Joi.string().optional(),
      equity_types: Joi.array().items(Joi.object({
        equity_type_id: Joi.string().required(),
        equity_name: Joi.string().required(),
      })).optional(),
      message: Joi.string().optional(),
      special_message: Joi.string().optional(),
      round: Joi.string().optional(),
      return_rate: Joi.number().optional(),
      data_sources: Joi.array().items(Joi.object({
        source_id: Joi.string().required(),
      })).optional(),
      repayment_period: Joi.string().optional(),
    }),
  },
  add_investor_to_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
    body: Joi.object({
      investor_id: Joi.string().required(),
      lead: Joi.boolean().optional().default(false),
      amount: Joi.number().optional().positive(),
      comment: Joi.string().optional(),
    }),
  },
  add_funding_type_to_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
    body: Joi.object({
      funding_type: Joi.string().required().valid(...Object.values(FundingType)),
    }),
  },
  add_data_source_to_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
    body: Joi.object({
      source_id: Joi.string().required(),
    }),
  },
  remove_investor_from_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
      investor_id: Joi.string().required(),
    }),
  },
  remove_funding_type_from_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
      funding_type: Joi.string().required().valid(...Object.values(FundingType)),
    }),
  },
  remove_data_source_from_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
      source_id: Joi.string().required(),
    }),
  },
  delete_funding_round: {
    query: Joi.object({
      round_id: Joi.string().required(),
    }),
  },
  create_funding_type: {
    body: Joi.object({
      title: Joi.string().required(),
      about: Joi.string().optional().default(''),
      name: Joi.string().required().valid(...Object.values(FundingType)),
      is_repayable: Joi.boolean().optional().default(false),
    }),
  },
  update_funding_type: {
    query: Joi.object({
      type_id: Joi.string().required(),
    }),
    body: Joi.object({
      updates: Joi.object(FundingTypeObject).required(),
    }),
  },
};
