/* eslint-disable no-param-reassign */
import NodeCache from 'node-cache';
import { ERROR_CODE } from '../../constants';
import ApiResponse, { ErrorType, SuccessType } from '../../utils/api-response';
import {
  add_pick,
  delete_author_reply_from_pick,
  delete_pick,
  delete_reply_from_pick,
  get_pick,
  get_pick_reply,
  reply_pick,
  update_author_pick_reply,
  update_pick,
  update_pick_reply,
} from './picks.service';
import Pick from './models/pick.model';
import { PickStatus } from './picks.enums';
import PickReply from './models/replies.model';

const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 120,
});

export default class PickController {
  static get_picks = async (req: any, res: any) => {
    try {
      const {
        search,
        page,
        limit,
        is_published,
        content_type,
        visibility,
        source,
        approval_status,
      } = req.query;

      const skip = (page - 1) * limit;

      const match: any = {};

      if (search) {
        match.$or = [
          {
            title: { $regex: search, $options: 'i' },
          },
          {
            _id: { $regex: search, $options: 'i' },
          },
          {
            description: { $regex: search, $options: 'i' },
          },
        ];
      }
      if (is_published) {
        match.is_published = is_published;
      }
      if (content_type) {
        match.content_type = content_type;
      }
      if (visibility) {
        match.visibility = visibility;
      }
      if (source) {
        match.source = source;
      }
      if (approval_status) {
        match.approval_status = approval_status;
      }

      const picks = await Pick.find(match)
        .populate('source').sort('-created_at').skip(skip)
        .limit(limit);
      const total = await Pick.countDocuments(picks);

      return ApiResponse.success(
        res,
        SuccessType.Retrieved,
        {
          total,
          page,
          limit,
          results: picks,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to retrieve funding round',
      );
    }
  };

  static get_pick = async (req: any, res: any) => {
    try {
      const {
        pick_id,
      } = req.query;

      const pick = await get_pick(pick_id);

      return ApiResponse.success(
        res,
        SuccessType.Retrieved,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to retrieve funding round',
      );
    }
  };

  static add_pick = async (req: any, res: any) => {
    const { user } = req.user;
    try {
      const {
        link,
        type,
        title,
        description,
        featured_image,
        source,
        source_name,
        content_type,
        tags,
        visibility,
      } = req.body;

      const pick = await add_pick({
        link,
        type,
        title,
        description,
        featured_image,
        source,
        source_name,
        content_type,
        tags,
        visibility,
        published_by: user._id,
        approval_status: PickStatus.Pending,
      });

      return ApiResponse.success(
        res,
        SuccessType.Created,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.ErrorType || ErrorType.InternalError,
        error.message || 'Failed to create pick',
      );
    }
  };

  static update_pick = async (req: any, res: any) => {
    try {
      const {
        user,
      } = req.user;

      const {
        pick_id,
        is_admin,
      } = req.query;

      const {
        link,
        type,
        title,
        description,
        featured_image,
        source,
        source_name,
        content_type,
        tags,
        visibility,
        is_published,
        approval_status,
        is_flagged,
      } = req.body;

      let pick;
      const update = {
        link,
        type,
        title,
        description,
        featured_image,
        source,
        source_name,
        content_type,
        tags,
        visibility,
        is_published,
        approval_status,
        is_flagged,
      };

      if (is_admin) {
        pick = await Pick.findByIdAndUpdate(pick_id, update);
      } else {
        pick = await Pick.findOneAndUpdate({
          _id: pick_id,
          picked_by: user._id,
        }, {
          ...update,
        });
      }

      if (!pick) {
        throw new Error('Unable to updated: No record found');
      }

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to update pick',
      );
    }
  };

  static delete_pick = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
        is_admin,
      } = req.query;

      let pick;
      if (is_admin) {
        pick = await delete_pick(pick_id);
      } else {
        pick = await Pick.findOneAndDelete({
          _id: pick_id,
          picked_by: user._id,
        });
      }

      if (!pick) {
        throw new Error('Unable to delete: No record found');
      }

      return ApiResponse.success(
        res,
        SuccessType.Deleted,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to delete pick',
      );
    }
  };

  static like = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_like_${pick_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already liked this pick',
        );
      }

      const pick = await get_pick(pick_id);
      pick.likes += 1;
      await update_pick(pick_id, {
        likes: pick.likes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to like pick',
      );
    }
  };

  static cancel_like = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_unlike_${pick_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already cancel like for this pick',
        );
      }

      const pick = await get_pick(pick_id);
      pick.likes -= 1;
      await update_pick(pick_id, {
        likes: pick.likes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to unlike pick',
      );
    }
  };

  static dislike = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_dislike_${pick_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already dislike this pick',
        );
      }

      const pick = await get_pick(pick_id);
      pick.dislikes += 1;
      await update_pick(pick_id, {
        dislikes: pick.dislikes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to dislike pick',
      );
    }
  };

  static cancel_dislike = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_dislike_cancel_${pick_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already cancel dislike for this pick',
        );
      }

      const pick = await get_pick(pick_id);
      pick.dislikes -= 1;
      await update_pick(pick_id, {
        dislikes: pick.dislikes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to undislike pick',
      );
    }
  };

  static click = async (req: any, res: any) => {
    try {
      const {
        pick_id,
        unique_click,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_click_${pick_id}_${unique_click}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already clicked this pick',
        );
      }

      const pick = await get_pick(pick_id);
      pick.clicks += 1;
      await update_pick(pick_id, {
        clicks: pick.clicks,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        pick,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to like pick',
      );
    }
  };

  static reply = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        pick_id,
        body,
      } = req.body;

      const reply = await reply_pick({
        pick: pick_id,
        body,
        author: user._id,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        reply,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to reply to pick',
      );
    }
  };

  static update_reply = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        reply_id,
        is_admin,
      } = req.query;

      const {
        body,
        is_flagged,
      } = req.body;

      let reply;

      if (is_admin) {
        reply = await update_pick_reply(reply_id, {
          is_flagged,
        });
      } else {
        reply = await update_author_pick_reply(reply_id, user._id, {
          body,
        });
      }

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        reply,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to update reply',
      );
    }
  };

  static delete_reply = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        reply_id,
        is_admin,
      } = req.query;

      let reply;
      if (is_admin) {
        reply = await delete_reply_from_pick(reply_id);
      } else {
        reply = await delete_author_reply_from_pick(reply_id, user._id);
      }

      return ApiResponse.success(
        res,
        SuccessType.Deleted,
        reply,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to delete reply',
      );
    }
  };

  static get_replies = async (req: any, res: any) => {
    try {
      const {
        pick_id,
        // is_sorted,
      } = req.query;

      const getRepliesWithNestedReplies = async (pickId: string) => {
        const replies = await PickReply.find({
          pick: pickId,
          parent: undefined,
        }).sort('-created_at').lean();

        const repliesWithNested = await Promise.all(replies.map(async (reply: any) => {
          reply.replies = await PickReply.find({
            parent: reply._id,
          }).lean().exec();
          return reply;
        }));

        return repliesWithNested;
      };

      const replies = await getRepliesWithNestedReplies(pick_id);

      return ApiResponse.success(
        res,
        SuccessType.Retrieved,
        replies,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to retrieve replies',
      );
    }
  };

  static like_reply = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        reply_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_like_reply_${reply_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already like this reply',
        );
      }

      const reply = await get_pick_reply(reply_id);
      reply.likes += 1;
      await update_pick_reply(reply_id, {
        likes: reply.likes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        reply,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to like reply',
      );
    }
  };

  static cancel_like_reply = async (req: any, res: any) => {
    try {
      const { user } = req.user;
      const {
        reply_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      const key = `pick_unlike_reply_${reply_id}_${user._id}`;
      if (cache.get(key)) {
        return ApiResponse.error(
          res,
          ERROR_CODE,
          ErrorType.Duplicate,
          'You have already cancel like for this reply',
        );
      }

      const reply = await get_pick_reply(reply_id);
      reply.likes -= 1;
      await update_pick_reply(reply_id, {
        likes: reply.likes,
      });

      return ApiResponse.success(
        res,
        SuccessType.Updated,
        reply,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to unlike reply',
      );
    }
  };
}
