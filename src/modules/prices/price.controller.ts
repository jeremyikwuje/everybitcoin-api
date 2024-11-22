import httpStatus, { BAD_REQUEST } from 'http-status';
import { parse } from 'json2csv';
import ApiResponse from '../../utils/api-response';
import APIError from '../../utils/api-error';
import Rate from './price.model';
import { get_recent_price } from './price.service';

export default class PriceController {
  static get_prices = async (req: any, res: any) => {
    try {
      const {
        market,
        ticker,
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
      if (ticker) {
        match.ticker = ticker;
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

      const prices = await Rate.find(match)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .select('-_id -__v');

      const total_count = await Rate.countDocuments(match);

      let csv_string: any = '';
      if (csv && total_count > 0) {
        const cleanRates = prices.map((doc) => doc.toObject());
        csv_string = parse(cleanRates);
      }

      return ApiResponse.success(
        res,
        'Successful',
        {
          total: total_count,
          count: prices.length,
          page,
          prices,
          csv_string,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || 'An error occurred',
      );
    }
  };

  static get_recent_price = async (req: any, res: any) => {
    try {
      const {
        ticker,
      } = req.query;

      const parallel = await get_recent_price(ticker);

      return ApiResponse.success(
        res,
        'Successful',
        {
          ticker,
          parallel,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || 'An error occurred',
      );
    }
  };

  static delete_prices = async (req: any, res: any) => {
    try {
      const {
        market,
        ticker,
        start_date,
        end_date,
      } = req.query;

      const match: any = {};

      if (market) {
        match.market = market;
      }
      if (ticker) {
        match.ticker = ticker;
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

      const prices = await Rate.deleteMany(match);
      const total_count = prices.deletedCount;

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
        error.message || 'An error occurred',
      );
    }
  };
}
