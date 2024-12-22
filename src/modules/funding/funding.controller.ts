import { ERROR_CODE } from '../../constants';
import logger from '../../logger/logger';
import ApiResponse from '../../utils/api-response';
import {
  create_funding_round,
  create_funding_type,
  delete_funding_round,
  get_funding_round,
  get_funding_types,
  remove_data_source_from_funding_round,
  remove_funding_type_from_funding_round,
  remove_investor_from_funding_round,
  update_funding_round,
  update_funding_type,
} from './funding.service';
import FundingRounds from './models/funding.round.model';

export default class FundingController {
  static get_funding_rounds = async (req: any, res: any) => {
    try {
      const {
        search,
        changer,
        is_published,
        page,
        limit,
        start_date,
        end_date,
        start_amount,
        end_amount,
        funding_type_id,
        investor_id,
        source_id,
        csv,
      } = req.query;

      const skip = (page - 1) * limit;

      // let match = {
      //   $and: [
      //     {
      //       $or: [
      //         {
      //           changer: { $regex: search, $options: 'i' },
      //         },
      //         {
      //           _id: { $regex: search, $options: 'i' },
      //         },
      //         {
      //           message: { $regex: search, $options: 'i' },
      //         }
      //       ],
      //     },
      //     {
      //       is_published: is_published === true || is_published === 'true' ? true : false,
      //     },
      //   ],
      // }

      const match: any = {};

      if (changer) {
        match.changer = changer;
      }
      if (start_date && end_date) {
        match.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
      }
      if (is_published) {
        match.is_published = !!(is_published === true || is_published === 'true');
      }
      if (start_amount && end_amount) {
        match.amount = { $gte: Number(start_amount), $lte: Number(end_amount) };
      }
      if (funding_type_id) {
        match.funding_types = { $in: [funding_type_id] };
      }
      if (investor_id) {
        match.investors = { $in: [investor_id] };
      }
      if (source_id) {
        match.data_sources = { $in: [source_id] };
      }

      const funding_rounds = await FundingRounds.find(match)
        .populate('changer').sort('-createdAt').skip(skip)
        .limit(limit);
      const total_results = await FundingRounds.countDocuments(match);

      return ApiResponse.success(
        res,
        'Successful',
        {
          total_result: total_results,
          page,
          page_size: limit,
          results: funding_rounds,
        },
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to retrieve funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to retrieve funding round',
      );
    }
  };

  static get_funding_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const funding_round = await get_funding_round(round_id);

      return ApiResponse.success(
        res,
        'Funding Round retrieved successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to retrieve funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to retrieve funding round',
      );
    }
  };

  static create_funding_round = async (req: any, res: any) => {
    try {
      const {
        amount,
        currency,
        changer,
        types,
        message,
        round,
        return_rate,
        data_sources,
        repayment_period,
      } = req.body;

      const funding_round = await create_funding_round({
        amount: {
          unit: currency,
          value: amount,
        },
        changer,
        types,
        message,
        round,
        return_rate,
        data_sources,
        repayment_period,
      });

      return ApiResponse.success(
        res,
        'Funding Round created successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to create funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to create funding round',
      );
    }
  };

  static update_funding_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const {
        amount,
        changer,
        message,
        special_message,
        round,
        return_rate,
        data_sources,
        repayment_period,
      } = req.body;

      const funding_round = await update_funding_round(
        round_id,
        {
          amount,
          changer,
          message,
          special_message,
          round,
          return_rate,
          data_sources,
          repayment_period,
        },
      );

      return ApiResponse.success(
        res,
        'Funding Round updated successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to update funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to update funding round',
      );
    }
  };

  static add_investor_to_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const {
        investor_id,
        lead,
        amount,
        comment,
      } = req.body;

      const funding_round = await update_funding_round(
        round_id,
        {
          investors: [
            {
              investor: investor_id,
              amount,
              lead,
              comment,
            },
          ],
        },
      );

      return ApiResponse.success(
        res,
        'Investor added to funding round successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to add investor to funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to add investor to funding round',
      );
    }
  };

  static add_funding_type_to_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const {
        funding_type,
      } = req.body;

      const current_funding_round = await get_funding_round(round_id);
      const existing_funding_type = current_funding_round.types.find(
        (type) => type.funding_type === funding_type,
      );
      if (existing_funding_type) {
        throw new Error('Duplicate funding type');
      }

      // Append the new funding_type to the existing types array
      const updated_types = [...current_funding_round.types, { funding_type }];

      // Update the funding round with the new types array
      const funding_round = await update_funding_round(
        round_id,
        {
          types: updated_types,
        },
      );

      return ApiResponse.success(
        res,
        'funding type added to funding round successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to add funding type to funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to add funding type to funding round',
      );
    }
  };

  static add_data_source_to_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const {
        source_id,
      } = req.body;

      const funding_round = await update_funding_round(
        round_id,
        {
          data_sources: [
            {
              source: source_id,
            },
          ],
        },
      );

      return ApiResponse.success(
        res,
        'Source added to funding round successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to add funding type to funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to add funding type to funding round',
      );
    }
  };

  static remove_investor_from_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
        investor_id,
      } = req.query;

      const remove_investor = await remove_investor_from_funding_round(
        round_id,
        investor_id,
      );

      return ApiResponse.success(
        res,
        'Investor removed from funding round successfully',
        remove_investor,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to remove investor from funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to remove investor from funding round',
      );
    }
  };

  static remove_funding_type_from_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
        funding_type,
      } = req.query;

      const remove_investor = await remove_funding_type_from_funding_round(
        round_id,
        funding_type,
      );

      return ApiResponse.success(
        res,
        'funding type removed from funding round successfully',
        remove_investor,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to remove funding type from funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to remove funding type from funding round',
      );
    }
  };

  static remove_data_source_from_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
        source_id,
      } = req.query;

      const remove_investor = await remove_data_source_from_funding_round(
        round_id,
        source_id,
      );

      return ApiResponse.success(
        res,
        'Data source removed from funding round successfully',
        remove_investor,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to remove Data source from funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to remove Data source from funding round',
      );
    }
  };

  static delete_funding_round = async (req: any, res: any) => {
    try {
      const {
        round_id,
      } = req.query;

      const funding_round = await delete_funding_round(round_id);

      return ApiResponse.success(
        res,
        'Funding round deleted successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to delete funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to delete funding round',
      );
    }
  };

  static create_funding_type = async (req: any, res: any) => {
    try {
      const {
        title,
        about,
        name,
        is_repayable,
      } = req.body;

      const funding_type = await create_funding_type({
        title,
        about,
        name,
        is_repayable,
      });

      return ApiResponse.success(
        res,
        'Successful',
        funding_type,
      );
    } catch (e: any) {
      logger.error(e.message || 'Failed to create funding type');
      return ApiResponse.error(
        res,
        e.statusCode || ERROR_CODE,
        e.message || 'Failed to create funding type',
      );
    }
  };

  static get_funding_types = async (req: any, res: any) => {
    try {
      const funding_types = await get_funding_types();

      return ApiResponse.success(
        res,
        'Successful',
        funding_types,
      );
    } catch (e: any) {
      logger.error(e.message || 'Failed to get funding type');
      return ApiResponse.error(
        res,
        e.statusCode || ERROR_CODE,
        e.message || 'Failed to create funding type',
      );
    }
  };

  static update_funding_type = async (req: any, res: any) => {
    try {
      const {
        type_id,
      } = req.query;

      const {
        updates,
      } = req.body;

      const funding_round = await update_funding_type(
        type_id,
        updates,
      );

      return ApiResponse.success(
        res,
        'Funding Round updated successfully',
        funding_round,
      );
    } catch (error: any) {
      logger.error(error.message || 'Failed to update funding round');
      return ApiResponse.error(
        res,
        error.statusCode || ERROR_CODE,
        error.message || 'Failed to update funding round',
      );
    }
  };
}
