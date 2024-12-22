import { Joi } from 'express-validation';
import { PickStatus, PickTags, PickVisibility } from './picks.enums';

export const PickValidation = {
  get_pick: {
    query: Joi.object({
      pick_id: Joi.string().required(),
    }),
  },
  get_picks: {
    query: Joi.object({
      order: Joi.string().optional().valid('asc', 'desc').default('asc'),
      is_sorted: Joi.boolean().optional().default(true),
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(30),
      search: Joi.string().optional(),
      visibility: Joi.string().optional().default(PickVisibility.Public),
      type: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional().valid(...Object.values(PickTags)),
      source: Joi.string().optional(),
      approval_status: Joi.string().optional().default(PickStatus.Accepted),
      is_published: Joi.boolean().optional().default(true),
    }),
  },
  add_pick: {
    body: Joi.object({
      link: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      featured_image: Joi.string().required(),
      type: Joi.string().required(),
      approval_status: Joi.string().required(),
      visibility: Joi.string().required(),
      content_type: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).optional().valid(...Object.values(PickTags))
        .default([PickTags.Bitcoin]),
      source: Joi.string().required(),
      source_name: Joi.string().required(),
      published_by: Joi.string().required(),
      is_published: Joi.boolean(),
    }),
  },
  update_pick: {
    query: Joi.object({
      pick_id: Joi.string().required(),
    }),
    body: Joi.object({
      link: Joi.string().optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      featured_image: Joi.string().optional(),
      type: Joi.string().optional(),
      status: Joi.string().optional(),
      visibility: Joi.string().optional(),
      content_type: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional().valid(...Object.values(PickTags)),
      source: Joi.string().optional(),
      source_name: Joi.string().optional(),
      is_published: Joi.boolean().optional(),
      picked_by: Joi.string().optional(),
      approval_status: Joi.string().optional(),
    }),
  },
  click: {
    query: Joi.object({
      pick_id: Joi.string().required(),
      unique_click: Joi.string().required(),
    }),
  },
  like: {
    query: Joi.object({
      pick_id: Joi.string().required(),
    }),
  },
  delete_pick: {
    query: Joi.object({
      pick_id: Joi.string().required(),
      is_admin: Joi.boolean().optional(),
    }),
  },
  get_replies: {
    query: Joi.object({
      pick_id: Joi.string().required(),
      order: Joi.string().valid('asc', 'desc').default('asc'),
      is_sorted: Joi.boolean().default(true),
    }),
  },
  reply: {
    body: Joi.object({
      pick: Joi.string().required(),
      body: Joi.string().required(),
    }),
  },
  like_reply: {
    query: Joi.object({
      reply_id: Joi.string().required(),
    }),
  },
  update_reply: {
    query: Joi.object({
      reply_id: Joi.string().required(),
      is_admin: Joi.boolean().default(false),
    }),
    body: Joi.object({
      body: Joi.string().optional(),
      is_flagged: Joi.boolean().optional(),
    }),
  },
  delete_reply: {
    query: Joi.object({
      reply_id: Joi.string().required(),
      is_admin: Joi.boolean().optional().default(false),
    }),
  },
};
