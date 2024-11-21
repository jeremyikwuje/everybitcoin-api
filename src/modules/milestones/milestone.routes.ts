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

router.get(
  '/get_milestone',
  validateSchema(MilestoneValidation.get_milestone),
  asyncWrapper(MilestoneController.get_milestone),
);

router.get(
  '/get_next_milestone',
  asyncWrapper(MilestoneController.get_next_milestone),
);

router.post(
  '/insert_milestones',
  asyncWrapper(MilestoneController.insert_milestones),
);

router.post(
  '/update_milestone',
  validateSchema(MilestoneValidation.update_milestone),
  asyncWrapper(MilestoneController.update_milestone),
);

export default router;
