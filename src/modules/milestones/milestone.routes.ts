import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import validateSchema from '../../middlewares/validate-schema.middleware';
import MilestoneController from './milestone.controller';
import { MilestoneValidation } from './milestone.validation';

const router = Router();

router.get(
  '/get_milestones',
  validateSchema(MilestoneValidation.get_milestones),
  asyncWrapper(MilestoneController.get_milestones),
);

export default router;
