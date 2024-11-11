import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import RateController from './price.controller';
import { RateValidation } from './price.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/get_prices',
  validateSchema(RateValidation.get_prices),
  asyncWrapper(RateController.get_prices),
);

router.get(
  '/get_price',
  validateSchema(RateValidation.get_price),
  asyncWrapper(RateController.get_recent_price),
);

router.post(
  '/delete_prices',
  validateSchema(RateValidation.delete_prices),
  asyncWrapper(RateController.delete_prices),
);

export default router;
