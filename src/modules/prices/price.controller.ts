import httpStatus, { BAD_REQUEST } from 'http-status';
import { parse } from 'json2csv';
import ApiResponse, { ErrorType } from '../../utils/api-response';
import APIError from '../../utils/api-error';
import Rate from './price.model';
import { get_recent_rate } from './price.service';
import { get_pairs_rate } from '../pairs/pair.service';
import { ERROR_MESSAGE } from '../../constants';

export default class rateController {
  static latest = async (req: any, res: any) => {
    try {
      const {
        market,
        base,
      } = req.query;

      const rates = await get_pairs_rate(base, market);

      return ApiResponse.success(
        res,
        'Successful',
        rates,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static get_rates = async (req: any, res: any) => {
    try {
      const {
        market,
        pair,
        page,
        limit,
        start_date,
        end_date,
        csv,
      } = req.query;

      const skip = (page - 1) * limit;
      const match: any = {};

      if (market) {
        match.market = market;
      }
      if (pair) {
        match.pair = pair;
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

        match.createdAt = {
          $gte: from,
          $lte: to,
        };
      }

      const rates = await Rate.find(match)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .select('-_id -__v');

      const total_count = await Rate.countDocuments(match);

      let csv_string: any = '';
      if (csv && total_count > 0) {
        const cleanRates = rates.map((doc) => doc.toObject());
        csv_string = parse(cleanRates);
      }

      return ApiResponse.success(
        res,
        'Successful',
        {
          total: total_count,
          count: rates.length,
          page,
          rates,
          csv_string,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static get_recent_rate = async (req: any, res: any) => {
    try {
      const {
        pair,
      } = req.query;

      const parallel = await get_recent_rate(pair);

      return ApiResponse.success(
        res,
        'Successful',
        {
          pair,
          parallel,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };

  static delete_rates = async (req: any, res: any) => {
    try {
      const {
        market,
        pair,
        start_date,
        end_date,
      } = req.query;

      const match: any = {};

      if (market) {
        match.market = market;
      }
      if (pair) {
        match.pair = pair;
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

        match.createdAt = {
          $gte: from,
          $lte: to,
        };
      }

      const rates = await Rate.deleteMany(match);
      const total_count = rates.deletedCount;

      return ApiResponse.success(
        res,
        'Successful',
        {
          deleted: total_count,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.errorType || ErrorType.InternalError,
        error.message || ERROR_MESSAGE,
      );
    }
  };
}
