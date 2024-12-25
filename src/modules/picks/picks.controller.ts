/* eslint-disable no-param-reassign */
import NodeCache from 'node-cache';
import { ERROR_CODE } from '../../constants';
import ApiResponse, { ErrorType, SuccessType } from '../../utils/api-response';
import {
  add_pick,
  delete_author_reply_from_pick,
  delete_pick,
  delete_reply_from_pick,
  get_link_meta,
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

      const picks = await Pick.find(match).sort('-created_at').skip(skip)
        .limit(limit);
      const total = await Pick.countDocuments(match);

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
    const { user } = req;
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
        picked_by: user._id.toString(),
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
      } = req;

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
        }, { new: true });
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
      const { user } = req;
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
      const { user } = req;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      let pick = await get_pick(pick_id);
      if (pick.liked_by?.includes(user._id)) {
        pick.likes -= 1;
        pick.liked_by = pick.liked_by?.filter(
          (id: string) => id.toString() !== user._id.toString(),
        );

        console.log('pick', pick.liked_by);
      } else {
        pick.likes += 1;
        pick.liked_by?.push(user._id);
      }

      if (pick.likes < 0) {
        pick.likes = 0;
      }

      pick = await update_pick(pick_id, {
        likes: pick.likes,
        liked_by: pick.liked_by || [],
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

  static dislike = async (req: any, res: any) => {
    try {
      const { user } = req;
      const {
        pick_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      let pick = await get_pick(pick_id);
      if (pick.disliked_by?.includes(user._id)) {
        pick.dislikes -= 1;
        pick.disliked_by = pick.disliked_by?.filter(
          (id: string) => id.toString() !== user._id.toString(),
        );
      } else {
        pick.dislikes += 1;
        pick.disliked_by?.push(user._id);
      }

      if (pick.dislikes < 0) {
        pick.dislikes = 0;
      }

      pick = await update_pick(pick_id, {
        dislikes: pick.dislikes,
        disliked_by: pick.disliked_by || [],
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

  static click = async (req: any, res: any) => {
    try {
      const {
        pick_id,
        unique_click,
      } = req.query;

      if (unique_click) {
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

        cache.set(key, true);
      }

      let pick = await get_pick(pick_id);
      pick.clicks += 1;
      pick = await update_pick(pick_id, {
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
      const { user } = req;
      const { pick_id } = req.query;
      const {
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
      const { user } = req;
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
      const { user } = req;
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
      const { user } = req;
      const {
        reply_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      let reply = await get_pick_reply(reply_id);
      if (reply.liked_by?.includes(user._id)) {
        reply.likes -= 1;
        reply.liked_by = reply.liked_by?.filter(
          (id: string) => id.toString() !== user._id.toString(),
        );
      } else {
        reply.likes += 1;
        reply.liked_by?.push(user._id);
      }

      if (reply.likes < 0) {
        reply.likes = 0;
      }

      reply = await update_pick_reply(reply_id, {
        likes: reply.likes,
        liked_by: reply.liked_by || [],
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

  static dislike_reply = async (req: any, res: any) => {
    try {
      const { user } = req;
      const {
        reply_id,
      } = req.query;

      // use nodecache to prevent multiple likes
      let reply = await get_pick_reply(reply_id);
      if (reply.disliked_by?.includes(user._id)) {
        reply.dislikes -= 1;
        reply.disliked_by = reply.disliked_by?.filter(
          (id: string) => id.toString() !== user._id.toString(),
        );
      } else {
        reply.dislikes += 1;
        reply.disliked_by?.push(user._id);
      }

      if (reply.dislikes < 0) {
        reply.dislikes = 0;
      }

      reply = await update_pick_reply(reply_id, {
        dislikes: reply.dislikes,
        disliked_by: reply.disliked_by || [],
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

  static get_pick_link_meta = async (req: any, res: any) => {
    try {
      const { link } = req.body;

      const meta = await get_link_meta(link);
      console.log(meta);

      const payload = {
        link,
        title: meta.title,
        description: meta.description,
        image: meta.image,
        favicon: meta.favicon,
      };

      return ApiResponse.success(
        res,
        SuccessType.Retrieved,
        payload,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Failed to retrieve link meta',
      );
    }
  };
}
