import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import UserController from './user.controller';
import { UserValidation } from './user.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.get(
  '/get_user',
  validateSchema(UserValidation.get_user),
  asyncWrapper(UserController.get_user),
);

router.get(
  '/get_all_users',
  validateSchema(UserValidation.get_users),
  asyncWrapper(UserController.get_users),
);

router.post(
  '/update_user',
  validateSchema(UserValidation.update_user),
  asyncWrapper(UserController.update_user),
);

router.post(
  '/update_user_usage',
  validateSchema(UserValidation.update_user_usage),
  asyncWrapper(UserController.update_user_usage),
);

router.post(
  '/create_subscription',
  validateSchema(UserValidation.create_subscription),
  asyncWrapper(UserController.create_subscription),
);

router.post(
  '/confirm_subscription',
  validateSchema(UserValidation.confirm_subscription),
  asyncWrapper(UserController.confirm_subscription),
);

router.post(
  '/delete_user',
  validateSchema(UserValidation.delete_user),
  asyncWrapper(UserController.delete_user),
);

export default router;
