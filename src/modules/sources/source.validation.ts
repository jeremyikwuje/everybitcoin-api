import { Joi } from 'express-validation';
import { ISource } from './source.enums';

const sourceKeys: (keyof ISource)[] = [
  'name',
  'title',
  'bio',
  'url',
  'icon',
  'is_active',
  'is_primary',
  'is_verified',
  'trust_score',
];

const sourceObject = sourceKeys.reduce((acc, key) => {
  acc[key] = Joi.any(); // or specify the type of validation you need
  return acc;
}, {} as Record<keyof ISource, any>);

export const SourceValidation = {
  get_source: {
    query: Joi.object({
      source_id: Joi.string().required(),
    }),
  },
  add_source: {
    body: Joi.object(sourceObject),
  },
  update_source: {
    query: Joi.object({
      source_id: Joi.string().required(),
    }),
    body: Joi.object({
      updates: Joi.object(sourceObject).required(),
    }),
  },
  delete_source: {
    query: Joi.object({
      source_id: Joi.string().required(),
    }),
  },
};
