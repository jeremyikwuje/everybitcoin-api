import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import PriceController from './price.controller';
import { PriceValidation } from './price.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/latest',
  validateSchema(PriceValidation.latest),
  asyncWrapper(PriceController.latest),
);

router.post(
  '/add_base',
  validateSchema(PriceValidation.add_base),
  asyncWrapper(PriceController.add_base),
);

router.post(
  '/add_quote',
  validateSchema(PriceValidation.add_quote),
  asyncWrapper(PriceController.add_quote),
);

router.get(
  '/get_prices',
  validateSchema(PriceValidation.get_prices),
  asyncWrapper(PriceController.get_prices),
);

router.get(
  '/get_price',
  validateSchema(PriceValidation.get_price),
  asyncWrapper(PriceController.get_recent_price),
);

router.post(
  '/delete_prices',
  validateSchema(PriceValidation.delete_prices),
  asyncWrapper(PriceController.delete_prices),
);

export default router;
