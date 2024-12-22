import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import SourceController from './source.controller';
import { SourceValidation } from './source.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/get_source',
  validateSchema(SourceValidation.get_source),
  asyncWrapper(SourceController.get_source),
);

router.post(
  '/add_source',
  validateSchema(SourceValidation.add_source),
  asyncWrapper(SourceController.add_source),
);

router.post(
  '/update_source',
  validateSchema(SourceValidation.update_source),
  asyncWrapper(SourceController.update_source),
);

router.post(
  '/delete_source',
  validateSchema(SourceValidation.delete_source),
  asyncWrapper(SourceController.delete_source),
);

export default router;
