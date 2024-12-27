import { BAD_REQUEST, CONFLICT } from 'http-status';
import ApiResponse from '../../utils/api-response';
import {
  add_new_currency,
  delete_currency,
  get_currency,
  get_all_currencies,
  update_currency,
  convert_currency,
} from './currency.service';
import APIError from '../../utils/api-error';

export default class CurrencyController {
  static add_currency = async (req: any, res: any) => {
    try {
      const {
        code,
        name,
        symbol,
        description,
        decimals,
        icon,
      } = req.body;

      const new_currency = await add_new_currency({
        code,
        name,
        symbol,
        description,
        decimals,
        icon,
      });

      return ApiResponse.success(res, 'Successful', new_currency);
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to add currency',
      );
    }
  };

  static get_currency = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const currency = await get_currency(code);

      return ApiResponse.success(
        res,
        'Successful',
        currency,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCodeCode || BAD_REQUEST,
        error.message || 'Unable to get currency',
      );
    }
  };

  static get_all_currencies = async (req: any, res: any) => {
    try {
      const currencies = await get_all_currencies();

      return ApiResponse.success(
        res,
        'Successful',
        currencies,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to get all currencies',
      );
    }
  };

  static delete_currency = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const deleted_currency = await delete_currency(code);
      if (!deleted_currency) {
        throw new APIError(
          'No currency deleted',
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
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to delete currency',
      );
    }
  };

  static update_currency = async (req: any, res: any) => {
    try {
      const {
        code,
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

      await update_currency(code, fields);

      return ApiResponse.success(
        res,
        'Successful',
        { code, ...fields },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to update currency',
      );
    }
  };

  static activate_currency = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const currency = await update_currency(code, { is_active: true });

      return ApiResponse.success(
        res,
        'Successful',
        currency,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to activate currency',
      );
    }
  };

  static deactivate_currency = async (req: any, res: any) => {
    try {
      const {
        code,
      } = req.query;

      const currency = await update_currency(code, { is_active: false });

      return ApiResponse.success(
        res,
        'Successful',
        currency,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to deactivate currency',
      );
    }
  };

  static convert_currency = async (req: any, res: any) => {
    try {
      const {
        from,
        to,
        amount,
      } = req.body;

      const conversion = await convert_currency(
        from,
        to,
        amount,
      );

      return ApiResponse.success(
        res,
        'Successful',
        conversion,
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || BAD_REQUEST,
        error.message || 'Unable to convert currency',
      );
    }
  };
}
