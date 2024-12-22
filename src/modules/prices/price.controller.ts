import httpStatus, { BAD_REQUEST } from 'http-status';
import { parse } from 'json2csv';
import ApiResponse, { ErrorType, SuccessType } from '../../utils/api-response';
import APIError from '../../utils/api-error';
import Price from './models/price.model';
import { get_recent_price } from './price.service';
import {
  add_currency_price, currency_price_found, get_currency_price, update_currency_price,
} from './services/currency.price.service';

export default class PriceController {
  static latest = async (req: any, res: any) => {
    const {
      base,
      quote,
    } = req.query;

    const get_price: any = await get_currency_price(base);

    const {
      quotes,
      updated_at,
    } = get_price;

    let result: any = Object.fromEntries(quotes);
    console.log(result);
    if (quote) {
      result = result[quote.toUpperCase()];
    }

    return ApiResponse.success(
      res,
      SuccessType.Retrieved,
      {
        base,
        rates: result,
        last_updated: updated_at,
      },
    );
  };

  static add_base = async (req: any, res: any) => {
    const { base, rates } = req.body;

    const data = {
      base,
      rates,
    };

    const base_found = await currency_price_found(base);
    if (base_found) {
      throw new APIError(
        'Base currency already exists',
        400,
        ErrorType.BadRequest,
      );
    }

    const rate = await add_currency_price(data);

    return ApiResponse.success(
      res,
      SuccessType.Created,
      rate,
    );
  };

  static add_quote = async (req: any, res: any) => {
    try {
      const {
        base,
        quote,
        rate,
      } = req.body;

      const get_rate = await get_currency_price(base);
      let { quotes } = get_rate;
      if (!quotes) {
        quotes = {};
      }

      if (quotes[quote]) {
        throw new APIError(
          'Quote already exists for the base currency',
          400,
          ErrorType.BadRequest,
        );
      }

      quotes = {
        ...quotes,
        [quote]: rate,
      };

      const data = {
        quotes,
      };

      const add_quote_rate = await update_currency_price(base, data);

      return ApiResponse.success(
        res,
        SuccessType.Created,
        add_quote_rate,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.errorType || ErrorType.InternalError,
        error.message || 'Error adding quote rate',
      );
    }
  };

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

      const prices = await Price.find(match)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .select('-_id -__v');

      const total_count = await Price.countDocuments(match);

      let csv_string: any = '';
      if (csv && total_count > 0) {
        const cleanRates = prices.map((doc: any) => doc.toObject());
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

      const prices = await Price.deleteMany(match);
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
