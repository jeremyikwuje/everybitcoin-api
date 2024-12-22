import mongoose from 'mongoose';
import httpStatus from 'http-status';

import APIError from '../../utils/api-error';
import { ErrorType } from '../../utils/api-response';
import Pick from './models/pick.model';
import {
  IPickCreate, IPickUpdate, IReplyCreate, IReplyUpdate,
} from './picks.enums';
import PickReply from './models/replies.model';

export const get_pick = async (pick_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(pick_id)) {
    throw new APIError(
      'Invalid pick id',
      httpStatus.BAD_REQUEST,
      ErrorType.BadRequest,
    );
  }

  const pick = await Pick.findById(pick_id);
  if (!pick) {
    throw new APIError(
      'No record found',
      httpStatus.NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return pick;
};

export const add_pick = async (pick: IPickCreate) => {
  try {
    const new_pick = new Pick(pick);
    await new_pick.save();

    return new_pick;
  } catch (e: any) {
    throw new APIError(
      `Unable to add pick: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const update_pick = async (pick_id: string, pick_entry: IPickUpdate) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(pick_id)) {
      throw new APIError(
        'Invalid pick id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const pick = await Pick.findByIdAndUpdate(
      pick_id,
      pick_entry,
      { new: true },
    );
    if (!pick) {
      throw new APIError('No record found');
    }

    return pick;
  } catch (e: any) {
    throw new APIError(
      `Unable to update pick: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const delete_pick = async (pick_id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(pick_id)) {
      throw new APIError(
        'Invalid id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const pick = await Pick.findByIdAndDelete(pick_id);
    if (!pick) {
      throw new APIError(
        'No record found',
        httpStatus.NOT_FOUND,
        ErrorType.InternalError,
      );
    }

    return pick;
  } catch (e: any) {
    throw new APIError(
      `Unable to delete pick: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const reply_pick = async (reply_entry: IReplyCreate) => {
  try {
    await get_pick(reply_entry.pick);
    const reply = new PickReply(reply_entry);
    await reply.save();

    return reply;
  } catch (e: any) {
    throw new APIError(
      `Unable to reply to pick: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const get_pick_reply = async (reply_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(reply_id)) {
    throw new APIError(
      'Invalid reply id',
      httpStatus.BAD_REQUEST,
      ErrorType.BadRequest,
    );
  }

  const reply = await PickReply.findById(reply_id);
  if (!reply) {
    throw new APIError(
      'No record found',
      httpStatus.NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return reply;
};

export const update_pick_reply = async (
  reply_id: string,
  reply_entry: IReplyUpdate,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reply_id)) {
      throw new APIError(
        'Invalid reply id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const reply = await PickReply.findOneAndUpdate(
      { _id: reply_id },
      reply_entry,
      { new: true },
    );
    if (!reply) {
      throw new APIError('No record found');
    }

    return reply;
  } catch (e: any) {
    throw new APIError(
      `Unable to update reply: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const update_author_pick_reply = async (
  reply_id: string,
  auhor: string,
  reply_entry: IReplyUpdate,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reply_id)) {
      throw new APIError(
        'Invalid reply id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const reply = await PickReply.findOneAndUpdate(
      { _id: reply_id, author: auhor },
      reply_entry,
      { new: true },
    );
    if (!reply) {
      throw new APIError('No record found');
    }

    return reply;
  } catch (e: any) {
    throw new APIError(
      `Unable to update reply: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const delete_reply_from_pick = async (reply_id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reply_id)) {
      throw new APIError(
        'Invalid id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const reply = await PickReply.findByIdAndDelete(reply_id);
    if (!reply) {
      throw new APIError(
        'No record found',
        httpStatus.NOT_FOUND,
        ErrorType.InternalError,
      );
    }

    return reply;
  } catch (e: any) {
    throw new APIError(
      `Unable to delete reply: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const delete_author_reply_from_pick = async (reply_id: string, author: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reply_id)) {
      throw new APIError(
        'Invalid id',
        httpStatus.BAD_REQUEST,
        ErrorType.BadRequest,
      );
    }

    const reply = await PickReply.findOneAndDelete({
      _id: reply_id,
      author,
    });
    if (!reply) {
      throw new APIError(
        'No record found',
        httpStatus.NOT_FOUND,
        ErrorType.InternalError,
      );
    }

    return reply;
  } catch (e: any) {
    throw new APIError(
      `Unable to delete reply: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};
