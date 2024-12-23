// generate routes for pricing
import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import { PricingValidation } from './pricing.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';
import PricingController from './pricing.controller';

const router = Router();

router.get(
  '/get_all_pricing',
  validateSchema(PricingValidation.get_all_pricing),
  asyncWrapper(PricingController.get_all_pricing),
);

router.get(
  '/get_pricing',
  validateSchema(PricingValidation.get_pricing),
  asyncWrapper(PricingController.get_pricing),
);

router.post(
  '/create_pricing',
  validateSchema(PricingValidation.create_pricing),
  asyncWrapper(PricingController.create_pricing),
);

router.post(
  '/update_pricing',
  validateSchema(PricingValidation.update_pricing),
  asyncWrapper(PricingController.update_pricing),
);

router.post(
  '/delete_pricing',
  validateSchema(PricingValidation.delete_pricing),
  asyncWrapper(PricingController.delete_pricing),
);

export default router;