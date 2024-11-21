import { BAD_REQUEST } from 'http-status';
import APIError from '../../utils/api-error';
import ApiResponse from '../../utils/api-response';
import { Milestone } from './milestone.model';
import { MilestonePrices } from './milestone.enums';
import {
  get_milestone,
  get_next_milestone,
  insert_milestones,
  update_milestone,
} from './milestone.service';

export default class MilestoneController {
  static get_milestones = async (req: any, res: any) => {
    try {
      const {
        type,
        start_date,
        end_date,
        price,
        start_price,
        end_price,
        is_future_target,
      } = req.query;

      const match: any = {};

      if (type) {
        match.type = type;
      }
      if (price) {
        match.price = price;
      }
      if (is_future_target) {
        match.is_future_target = is_future_target;
      }

      if (start_date) {
        if (start_date > end_date) {
          throw new APIError(
            'Start date cannot be greater than end date',
            BAD_REQUEST,
          );
        }

        const from = new Date(start_date * 1000);
        const to = new Date(end_date * 1000);

        match.date_achieved = {
          $gte: from,
          $lte: to,
        };
      }

      if (start_price && end_price) {
        match.price = {
          $gte: start_price,
          $lte: end_price,
        };
      }

      const milestones = await Milestone.find(match);

      return ApiResponse.success(
        res,
        'Successful',
        milestones,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 400,
        error.message || 'An error occurred',
      );
    }
  };

  static get_milestone = async (req: any, res: any) => {
    try {
      const {
        price,
      } = req.query;

      const milestone = await get_milestone(price);

      return ApiResponse.success(
        res,
        'Successful',
        milestone,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 400,
        error.message || 'An error occurred',
      );
    }
  };

  static get_next_milestone = async (req: any, res: any) => {
    try {
      const milestone = await get_next_milestone();

      return ApiResponse.success(res, 'successful', milestone);
    } catch (e: any) {
      return ApiResponse.error(
        res,
        e.statusCode || 400,
        e.message || 'An error occurred',
      );
    }
  };

  static insert_milestones = async (req: any, res: any) => {
    try {
      const milestones = MilestonePrices.map((milestone) => ({
        price: milestone.price,
        date_achieved: new Date(milestone.date),
        market_cap: milestone.price * 21000000,
      }));

      const insertedMilestones = await insert_milestones(milestones);

      return ApiResponse.success(
        res,
        'Milestones inserted successfully',
        insertedMilestones,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 400,
        error.message || 'An error occurred',
      );
    }
  };

  static update_milestone = async (req: any, res: any) => {
    try {
      const { price } = req.query;

      const {
        fields,
      } = req.body;

      const milestone = await update_milestone(price, fields);

      return ApiResponse.success(
        res,
        'Milestone updated successfully',
        milestone,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 400,
        error.message || 'An error occurred',
      );
    }
  };
}
