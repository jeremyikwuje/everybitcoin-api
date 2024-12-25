import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import PickController from './picks.controller';
import { PickValidation } from './picks.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';
import { user_middleware } from '../../middlewares/user.middleware';

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
  '/get_pick_link_meta',
  validateSchema(PickValidation.get_pick_link_meta),
  asyncWrapper(PickController.get_pick_link_meta),
);

router.post(
  '/add_pick',
  user_middleware,
  validateSchema(PickValidation.add_pick),
  asyncWrapper(PickController.add_pick),
);

router.post(
  '/update_pick',
  user_middleware,
  validateSchema(PickValidation.update_pick),
  asyncWrapper(PickController.update_pick),
);

router.post(
  '/delete_pick',
  user_middleware,
  validateSchema(PickValidation.delete_pick),
  asyncWrapper(PickController.delete_pick),
);

router.post(
  '/click_pick',
  user_middleware,
  validateSchema(PickValidation.click),
  asyncWrapper(PickController.click),
);

router.post(
  '/like_pick',
  user_middleware,
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.like),
);

router.post(
  '/dislike_pick',
  user_middleware,
  validateSchema(PickValidation.like),
  asyncWrapper(PickController.dislike),
);

router.post(
  '/reply_pick',
  user_middleware,
  validateSchema(PickValidation.reply_pick),
  asyncWrapper(PickController.reply),
);

router.get(
  '/get_replies',
  user_middleware,
  validateSchema(PickValidation.get_replies),
  asyncWrapper(PickController.get_replies),
);

router.post(
  '/update_reply',
  user_middleware,
  validateSchema(PickValidation.update_reply),
  asyncWrapper(PickController.update_reply),
);

router.post(
  '/delete_reply',
  user_middleware,
  validateSchema(PickValidation.delete_reply),
  asyncWrapper(PickController.delete_reply),
);

router.post(
  '/like_reply',
  user_middleware,
  validateSchema(PickValidation.like_reply),
  asyncWrapper(PickController.like_reply),
);

router.post(
  '/dislike_reply',
  user_middleware,
  validateSchema(PickValidation.like_reply),
  asyncWrapper(PickController.dislike_reply),
);

export default router;
