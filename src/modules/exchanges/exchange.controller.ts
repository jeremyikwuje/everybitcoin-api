import { BAD_REQUEST, CONFLICT } from 'http-status';
import ApiResponse from '../../utils/api-response';
import {
  add_new_exchange,
  activate_exchange,
  deactivate_exchange,
  delete_exchange,
  get_exchange,
  get_all_exchanges,
  update_exchange,
} from './exchange.service';
import APIError from '../../utils/api-error';

export default class ExchangeController {
  static activate_exchange = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      await activate_exchange(code);

      return ApiResponse.success(
        res,
        'Successful',
        { code },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to activate exchange',
      );
    }
  };

  static add_exchange = async (req: any, res: any) => {
    try {
      const {
        name,
        code,
        link,
        icon,
        bio,
      } = req.body;

      const new_exchange = await add_new_exchange({
        name,
        code,
        link,
        icon,
        bio,
      });

      return ApiResponse.success(res, 'Successful', new_exchange);
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to add exchange',
      );
    }
  };

  static deactivate_exchange = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      await deactivate_exchange(code);

      return ApiResponse.success(
        res,
        'Successful',
        { code },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to deactivate exchange',
      );
    }
  };

  static delete_exchange = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const deleted_exchange = await delete_exchange(code);
      if (!deleted_exchange) {
        throw new APIError(
          'No exchange was deleted',
          CONFLICT,
        );
      }

      return ApiResponse.success(
        res,
        'Successful',
        { code },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCodeCode || BAD_REQUEST,
        error.message || 'Unable to delete exchange',
      );
    }
  };

  static get_exchange = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const exchange = await get_exchange(code);

      return ApiResponse.success(
        res,
        'Successful',
        exchange,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to get exchange',
      );
    }
  };

  static get_all_exchanges = async (req: any, res: any) => {
    try {
      const exchanges = await get_all_exchanges();

      return ApiResponse.success(
        res,
        'Successful',
        { total: exchanges.length, exchanges },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to get exchanges',
      );
    }
  };

  static update_exchange = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const {
        fields,
      } = req.body;

      if (Object.entries(fields).length === 0) {
        throw new APIError(
          'Nothing to update',
          BAD_REQUEST,
        );
      }

      await update_exchange(code, fields);

      return ApiResponse.success(
        res,
        'Successful',
        { code, ...fields },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to update exchange',
      );
    }
  };
}
