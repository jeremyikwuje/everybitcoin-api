import { ERROR_CODE } from '../../constants';
import logger from '../../logger/logger';
import ApiResponse, { ErrorType } from '../../utils/api-response';
import {
  add_source, delete_source, get_source, update_source,
} from './source.service';

export default class FundingController {
  static get_source = async (req: any, res: any) => {
    try {
      const {
        source_id,
      } = req.query;

      const source = await get_source(source_id);

      return ApiResponse.success(
        res,
        'Successful',
        source,
      );
    } catch (error: any) {
      logger.error(`Error getting source: ${error.message}`);
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Error getting source',
      );
    }
  };

  static add_source = async (req: any, res: any) => {
    try {
      const {
        name,
        title,
        bio,
        url,
        icon,
        is_active,
        is_primary,
        is_verified,
        trust_score,
      } = req.body;

      const source = await add_source({
        name,
        title,
        bio,
        url,
        icon,
        is_active,
        is_primary,
        is_verified,
        trust_score,
      });

      return ApiResponse.success(
        res,
        'Successful',
        { source },
      );
    } catch (error: any) {
      logger.error(`Error adding source: ${error.message}`);
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Error adding source',
      );
    }
  };

  static update_source = async (req: any, res: any) => {
    try {
      const {
        source_id,
      } = req.query;

      const {
        updates,
      } = req.body;

      const source = await update_source(source_id, updates);

      return ApiResponse.success(
        res,
        'Successful',
        source,
      );
    } catch (error: any) {
      logger.error(`Error updating source: ${error.message}`);
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Error updating source',
      );
    }
  };

  static delete_source = async (req: any, res: any) => {
    try {
      const {
        source_id,
      } = req.query;

      const source = await delete_source(source_id);

      return ApiResponse.success(
        res,
        'Successful',
        source,
      );
    } catch (error: any) {
      logger.error(`Error deleting source: ${error.message}`);
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.errorType || ErrorType.InternalError,
        error.message || 'Error deleting source',
      );
    }
  };
}
