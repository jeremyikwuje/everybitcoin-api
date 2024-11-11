import { BAD_REQUEST } from "http-status";
import APIError from "../../utils/api-error";
import ApiResponse from "../../utils/api-response";
import { Milestone } from "./milestone.model";


export default class MilestoneController {
  static get_milestones = async (req: any, res: any) => {
    try {
      const {
        page,
        type,
        start_date,
        end_date,
        price,
        start_price,
        end_price,
        is_future_target,
      } = req.query;

      const match: any = {
        type,
        is_future_target,
        price,
      };

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
      )
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 400,
        error.message || 'An error occurred',
      );
    }
  };
}