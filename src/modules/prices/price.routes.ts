import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import RateController from './price.controller';
import { RateValidation } from './price.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/latest',
  validateSchema(RateValidation.latest),
  asyncWrapper(RateController.latest),
);

router.get(
  '/get_rates',
  validateSchema(RateValidation.get_rates),
  asyncWrapper(RateController.get_rates),
);

router.get(
  '/get_rate',
  validateSchema(RateValidation.get_rate),
  asyncWrapper(RateController.get_recent_rate),
);

router.post(
  '/delete_rates',
  validateSchema(RateValidation.delete_rates),
  asyncWrapper(RateController.delete_rates),
);

export default router;
