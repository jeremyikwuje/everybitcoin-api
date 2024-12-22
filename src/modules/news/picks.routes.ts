import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import PickController from './picks.controller';
import { PickValidation } from './picks.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/get_picks',
  validateSchema(PickValidation.get_picks),
  asyncWrapper(PickController.get_picks),
);

router.get(
  '/get_pick',
  validateSchema(PickValidation.get_pick),
  asyncWrapper(PickController.get_pick),
);

router.post(
  '/add_pick',
  validateSchema(PickValidation.add_pick),
  asyncWrapper(PickController.add_pick),
);

router.post(
  '/update_pick',
  validateSchema(PickValidation.update_pick),
  asyncWrapper(PickController.update_pick),
);

router.post(
  '/delete_pick',
  validateSchema(PickValidation.delete_pick),
  asyncWrapper(PickController.delete_pick),
);

router.post(
  '/like_pick',
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.like),
);

router.post(
  '/cancel_pick_like',
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.cancel_like),
);

router.post(
  '/dislike_pick',
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.dislike),
);

router.post(
  '/cancel_pick_dislike',
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.cancel_dislike),
);

router.post(
  '/add_reply',
  validateSchema(PickValidation.reply),
  asyncWrapper(PickController.reply),
);

router.post(
  '/update_reply',
  validateSchema(PickValidation.update_reply),
  asyncWrapper(PickController.update_reply),
);

router.post(
  '/delete_reply',
  validateSchema(PickValidation.delete_reply),
  asyncWrapper(PickController.delete_reply),
);

router.post(
  '/like_reply',
  validateSchema(PickValidation.like_reply),
  asyncWrapper(PickController.like_reply),
);

export default router;
