import { NOT_ACCEPTABLE, NOT_FOUND, NOT_MODIFIED } from 'http-status';
import { Types } from 'mongoose';
import APIError from '../../utils/api-error';
import { IMilestone } from './milestone.enums';
import { Milestone } from './milestone.model';
import { get_ticker } from '../tickers/ticker.service';
import Time from '../../utils/time';

export const create_milestone = async (milestone: IMilestone) => {
  try {
    const new_milestone = await Milestone.create(milestone);
    return new_milestone;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to create new milestones',
      NOT_ACCEPTABLE || e.statusCode,
    );
  }
};

export const get_milestone = async (unique_id: any) => {
  try {
    let match;

    if (Types.ObjectId.isValid(unique_id)) {
      match = {
        _id: unique_id,
      };
    } else {
      match = {
        price: unique_id,
      };
    }

    const milestone = await Milestone.findOne(match);

    if (!milestone) {
      throw new APIError(
        'No milestone found',
        NOT_FOUND,
      );
    }

    return milestone;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to get milestone',
      e.statusCode || NOT_FOUND,
    );
  }
};

export const update_milestone = async (
  price: number,
  milestone: IMilestone,
) => {
  try {
    const updated_milestone = await Milestone.findOneAndUpdate({
      price,
    }, milestone, {
      new: true,
    });

    if (!updated_milestone) {
      throw new APIError(
        'No milestone found',
        NOT_FOUND,
      );
    }

    return updated_milestone;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to update milestone',
      e.statusCode || NOT_MODIFIED,
    );
  }
};

export const insert_milestones = async (
  milestones: IMilestone[],
) => {
  try {
    await Promise.all(milestones.map(async (milestone) => {
      const existing_milestone = await Milestone.findOne({
        price: milestone.price,
      });

      if (existing_milestone) {
        await update_milestone(
          milestone.price || 0,
          milestone,
        );

        return true;
      }

      await create_milestone(milestone);

      return true;
    }));

    return milestones;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to insert milestones',
      e.statusCode || NOT_ACCEPTABLE,
    );
  }
};

export const set_next_milestone = async () => {
  try {
    const milestone = await Milestone.findOne({
      is_future_target: true,
    });

    if (!milestone) {
      // get the highest price milestone
      const highest_milestone = await Milestone.findOne({
        is_future_target: false,
      }).sort({
        price: -1,
      });

      if (!highest_milestone) {
        throw new APIError(
          'No milestone found',
          NOT_FOUND,
        );
      } else {
        throw new APIError(
          'No milestone found',
          NOT_FOUND,
        );
      }

      // set the next milestone target
      // const next_price = highest_milestone.price + 1000;
      // await create_milestone({
      //   price: next_price,
      //   is_future_target: true,
      // });

      // return next_price;
    }

    // get the current bitcoin price
    const symbol = 'BTC-USD'.toLowerCase();
    const ticker = await get_ticker(symbol);
    const current_price = ticker.price;

    if (current_price <= milestone.price) {
      return milestone;
    }

    // update the current milestone target
    await update_milestone(
      milestone.price,
      {
        is_future_target: false,
      },
    );

    // calculate the next milestone
    const milestones = [];
    let next_milestone_price = milestone.price + 1000;
    while (current_price >= next_milestone_price) {
      milestones.push(create_milestone({
        price: next_milestone_price,
        date_achieved: new Date(Time.today()),
        is_future_target: false,
      }));

      next_milestone_price += 1000;
    }
    await Promise.all(milestones);

    if (next_milestone_price > current_price) {
      milestones.push(create_milestone({
        price: next_milestone_price,
        is_future_target: true,
      }));
    }

    return next_milestone_price;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to get milestone',
      e.statusCode || NOT_FOUND,
    );
  }
};

export const get_next_milestone = async () => {
  try {
    const milestone = await Milestone.findOne({
      is_future_target: true,
    });

    if (!milestone) {
      throw new APIError(
        'No milestone found',
        NOT_FOUND,
      );
    }

    return milestone;
  } catch (e: any) {
    throw new APIError(
      e.message || 'Unable to get milestone',
      e.statusCode || NOT_FOUND,
    );
  }
};
