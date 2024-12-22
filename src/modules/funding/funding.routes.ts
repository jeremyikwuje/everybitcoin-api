import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import FundingController from './funding.controller';
import { FundingValidation } from './funding.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/get_funding_rounds',
  validateSchema(FundingValidation.get_funding_rounds),
  asyncWrapper(FundingController.get_funding_rounds),
);

router.get(
  '/get_funding_round',
  validateSchema(FundingValidation.get_funding_round),
  asyncWrapper(FundingController.get_funding_round),
);

router.post(
  '/create_funding_round',
  validateSchema(FundingValidation.create_funding_round),
  asyncWrapper(FundingController.create_funding_round),
);

router.post(
  '/update_funding_round',
  validateSchema(FundingValidation.update_funding_round),
  asyncWrapper(FundingController.update_funding_round),
);

router.post(
  '/add_investor_to_round',
  validateSchema(FundingValidation.add_investor_to_round),
  asyncWrapper(FundingController.add_investor_to_round),
);

router.post(
  '/add_funding_type_to_round',
  validateSchema(FundingValidation.add_funding_type_to_round),
  asyncWrapper(FundingController.add_funding_type_to_round),
);

router.post(
  '/add_data_source_to_round',
  validateSchema(FundingValidation.add_data_source_to_round),
  asyncWrapper(FundingController.add_data_source_to_round),
);

router.post(
  '/remove_investor_from_round',
  validateSchema(FundingValidation.remove_investor_from_round),
  asyncWrapper(FundingController.remove_investor_from_round),
);

router.post(
  '/remove_equity_type_from_round',
  validateSchema(FundingValidation.remove_funding_type_from_round),
  asyncWrapper(FundingController.remove_funding_type_from_round),
);

router.post(
  '/remove_data_source_from_round',
  validateSchema(FundingValidation.remove_data_source_from_round),
  asyncWrapper(FundingController.remove_data_source_from_round),
);

router.post(
  '/delete_funding_round',
  validateSchema(FundingValidation.delete_funding_round),
  asyncWrapper(FundingController.delete_funding_round),
);

router.post(
  '/create_funding_type',
  validateSchema(FundingValidation.create_funding_type),
  asyncWrapper(FundingController.create_funding_type),
);

router.get(
  '/get_funding_types',
  asyncWrapper(FundingController.get_funding_types),
);

router.post(
  '/update_funding_type',
  validateSchema(FundingValidation.update_funding_type),
  asyncWrapper(FundingController.update_funding_type),
);

export default router;
