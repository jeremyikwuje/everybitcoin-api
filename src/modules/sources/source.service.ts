import mongoose from 'mongoose';
import httpStatus from 'http-status';

import { ISource } from './source.enums';
import Source from './source.model';
import APIError from '../../utils/api-error';
import { ErrorType } from '../../utils/api-response';

export const get_source = async (unique: string) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = { name: unique };
  }

  // get source by id
  const source = await Source.findOne(query);
  if (!source) {
    throw new APIError(
      'No source found',
      httpStatus.NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return source;
};

export const add_source = async (source: ISource) => {
  try {
    const source_found = await Source.findOne({ name: source.name });
    if (source_found) {
      throw new APIError(
        'Source already exists',
        httpStatus.CONFLICT,
        ErrorType.Duplicate,
      );
    }

    // create source
    const new_source = new Source(source);
    await new_source.save();

    return new_source;
  } catch (e: any) {
    throw new APIError(
      `Unable to add source: ${e.message}`,
      httpStatus.NOT_IMPLEMENTED,
      ErrorType.InternalError,
    );
  }
};

export const delete_source = async (unique: string) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = { name: unique };
  }

  // delete source by id
  const result = await Source.findOneAndDelete(query);
  if (!result) {
    throw new APIError(
      'Source not found',
      httpStatus.NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return result;
};

export const update_source = async (unique: string, updates: ISource) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = { name: unique };
  }

  // update source by id
  const source = await Source.findOneAndUpdate(query, updates, { new: true });
  if (!source) {
    throw new APIError(
      'Unable to update source',
      httpStatus.NOT_MODIFIED,
      ErrorType.InternalError,
    );
  }

  return source;
};
