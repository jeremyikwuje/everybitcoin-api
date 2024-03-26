import httpStatus from 'http-status';
import ApiResponse from '../utils/api-response';
import { cardFound } from '../modules/issuing/card/card.service';

export const cardExistMiddleware = async (req: any, res: any, next: any) => {
  try {
    const owner = req.business._id;
    const card_id = req.query.card_id || req.body.card_id || '';

    // todo: card exist
    if (!cardFound(card_id, owner)) {
      return ApiResponse.error(
        res,
        httpStatus.NOT_FOUND,
        'Card not found',
      );
    }

    return next();
  } catch (error) {
    return ApiResponse.error(
      res,
      httpStatus.NOT_FOUND,
      'Unknown card',
    );
  }
};
