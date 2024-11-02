import { BAD_REQUEST, CONFLICT } from 'http-status';
import ApiResponse from '../../utils/api-response';
import {
  add_new_ticker,
  activate_ticker,
  deactivate_ticker,
  delete_ticker,
  get_ticker,
  get_all_tickers,
  update_ticker,
} from './ticker.service';
import APIError from '../../utils/api-error';
import { get_exchange } from '../exchanges/exchange.service';
import { tickerExchangeDTO } from './ticker.enums';

export default class TickerController {
  static activate_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      await activate_ticker(symbol);

      return ApiResponse.success(
        res,
        'Successful',
        { symbol },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to activate ticker',
      );
    }
  };

  static add_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.body;

      const new_ticker = await add_new_ticker(symbol);

      return ApiResponse.success(res, 'Successful', new_ticker);
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to add ticker',
      );
    }
  };

  static deactivate_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      await deactivate_ticker(symbol);

      return ApiResponse.success(
        res,
        'Successful',
        { symbol },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to deactivate ticker',
      );
    }
  };

  static delete_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      const deleted_ticker = await delete_ticker(symbol);
      if (!deleted_ticker) {
        throw new APIError(
          'No ticker deleted',
          CONFLICT,
        );
      }

      return ApiResponse.success(
        res,
        'Successful',
        { symbol },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to delete ticker',
      );
    }
  };

  static get_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      const ticker = await get_ticker(symbol);

      return ApiResponse.success(
        res,
        'Successful',
        ticker,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCodeCode || BAD_REQUEST,
        error.message || 'Unable to get ticker',
      );
    }
  };

  static get_all_tickers = async (req: any, res: any) => {
    try {
      const {
        page,
      } = req.query;

      const limit = page * 10;

      const tickers = await get_all_tickers(limit);

      return ApiResponse.success(
        res,
        'Successful',
        tickers,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to get all tickers',
      );
    }
  };

  static get_ticker_exchanges = async (req: any, res: any) => {
    try {
      const {
        symbol,
        exchange_code,
      } = req.query;

      const ticker = await get_ticker(symbol);
      let result: any = [];
      if (exchange_code) {
        const exchange = ticker.exchanges.find((ex: any) => ex.code === exchange_code);
        if (!exchange) {
          throw new APIError(
            'Exchange not found',
            BAD_REQUEST,
          );
        }

        result = exchange;
      } else {
        result = ticker.exchanges;
      }

      return ApiResponse.success(
        res,
        'Successful',
        result,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCodeCode || BAD_REQUEST,
        error.message || 'Unable to get ticker exchanges',
      );
    }
  };

  static update_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      const {
        fields,
      } = req.body;

      if (Object.entries(fields).length === 0) {
        throw new APIError(
          'No field to update',
          BAD_REQUEST,
        );
      }

      await update_ticker(symbol, fields);

      return ApiResponse.success(
        res,
        'Successful',
        { symbol, ...fields },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to update ticker',
      );
    }
  };

  static add_exchange_to_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
      } = req.query;

      const {
        exchange_code,
      } = req.body;

      // check if exchange exist
      await get_exchange(exchange_code);

      let ticker = await get_ticker(symbol);
      const exchanges = ticker.exchanges as tickerExchangeDTO[];

      // if exchange code is found
      if (exchanges.find((ex: any) => ex.code === exchange_code)) {
        throw new APIError(
          `${exchange_code} exchange already exists for this ticker`,
          CONFLICT,
        );
      }

      // add exchange to existing
      exchanges.push({
        code: exchange_code,
      });

      ticker = await update_ticker(symbol, { exchanges });

      return ApiResponse.success(
        res,
        'Successful',
        { symbol, exchanges: ticker.exchanges },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to add exchange to ticker',
      );
    }
  };

  static update_exchange_in_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
        exchange_code,
      } = req.query;

      const {
        fields,
      } = req.body;

      if (Object.entries(fields).length === 0) {
        throw new APIError(
          'No field to update',
          BAD_REQUEST,
        );
      }

      let ticker = await get_ticker(symbol);
      const exchanges = ticker.exchanges as tickerExchangeDTO[];

      // if exchange code is found
      const index = exchanges.findIndex((ex: any) => ex.code === exchange_code);
      if (index === -1) {
        throw new APIError(
          `${exchange_code} exchange not found for this ticker`,
          CONFLICT,
        );
      }

      // update exchange in existing
      exchanges[index] = { ...exchanges[index], ...fields };

      ticker = await update_ticker(symbol, { exchanges });

      return ApiResponse.success(
        res,
        'Successful',
        { symbol, exchanges: ticker.exchanges },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to update exchange in ticker',
      );
    }
  };

  static remove_exchange_from_ticker = async (req: any, res: any) => {
    try {
      const {
        symbol,
        exchange_code,
      } = req.query;

      let ticker = await get_ticker(symbol);
      const exchanges = ticker.exchanges as tickerExchangeDTO[];

      // if exchange code is found
      const index = exchanges.findIndex((ex: any) => ex.code === exchange_code);
      if (index === -1) {
        throw new APIError(
          `${exchange_code} exchange not found for this ticker`,
          CONFLICT,
        );
      }

      // remove exchange from existing
      exchanges.splice(index, 1);

      ticker = await update_ticker(symbol, { exchanges });

      return ApiResponse.success(
        res,
        'Successful',
        { symbol, exchanges: ticker.exchanges },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to remove exchange from ticker',
      );
    }
  };
}
