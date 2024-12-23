import mongoose from 'mongoose';
import { NOT_FOUND } from 'http-status';
import { INewUser, IUser } from './user.enums';
import User from './user.model';
import { ErrorType } from '../../utils/api-response';
import APIError from '../../utils/api-error';
import { get_all_pricing, get_pricing } from '../pricing/pricing.service';
import logger from '../../logger/logger';

export const get_user_by_id = async (id: string) => {
  // get user by id
  const user = await User.findById(id).populate({
    path: 'plan.id',
    model: 'pricing',
    match: { code: { $exists: true } }, // Ensure the code exists
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const get_user = async (unique: string) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = {
      $or: [
        { email: unique },
        { api_key: unique },
      ],
    };
  }

  const user = await User.findOne(query).populate('plan');

  if (!user) {
    throw new APIError(
      'No account found',
      NOT_FOUND,
      ErrorType.NotFound,
    );
  }

  return user;
};

export const add_user = async (data: INewUser) => {
  try {
    // create user
    const user = new User(data);
    await user.save();
    await user.populate('plan');

    const { password, ...user_without_password } = user.toObject();

    return user_without_password;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user');
  }
};

export const update_user = async (unique: string, data: Partial<IUser>) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = { email: unique };
  }

  // update user
  const user = await User.findOneAndUpdate(query, data, { new: true });
  if (!user) {
    throw new Error('User not found');
  }

  const {
    password,
    ...user_without_password
  } = user.toObject();

  return user_without_password;
};

export const delete_user = async (unique: string) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(unique)) {
    query = { _id: unique };
  } else {
    query = { email: unique };
  }

  // delete user
  const user = await User.findOneAndDelete(query);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const email_found = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  return true;
};

export const reset_user_plan = async (user: string) => {
  try {
    const pricing = await get_all_pricing(true);
    const plan = pricing.find((p: any) => p.code === 'free');
    const updated = await update_user(user, { plan: plan._id });

    return updated;
  } catch (error: any) {
    logger.error(error.message || 'Error reseting user plan to free');
    throw new APIError(
      error.message || 'Error reseting user plan to free',
      error.statusCode || 500,
    );
  }
};

export const upgrade_user_plan = async (user: string, plan: string) => {
  try {
    const pricing = await get_pricing(plan);
    const updated = await update_user(user, { plan: pricing._id });
    return updated;
  } catch (error: any) {
    logger.error(error.message || 'Error upgrading user plan');
    throw new APIError(
      error.message || 'Error upgrading user plan',
      error.statusCode || 500,
    );
  }
};

export const reset_users_usage = async () => {
  try {
    await User.updateMany({}, {
      usage: {
        credit_balance: 0,
        requests_limit_per_minute: 0,
        requests_made_this_month: 0,
        requests_made_this_day: 0,
      },
    });
  } catch (error: any) {
    logger.error(error.message || 'Error reseting users usage');
  }
};
