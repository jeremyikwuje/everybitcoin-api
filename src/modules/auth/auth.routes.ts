import { Router } from 'express';
import AuthController from './auth.controller';
import { asyncWrapper } from '../../utils/async-wrapper';
import validateSchema from '../../middlewares/validate-schema.middleware';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateSchema(AuthValidation.register),
  asyncWrapper(AuthController.register),
);

router.post(
  '/login',
  validateSchema(AuthValidation.login),
  asyncWrapper(AuthController.login),
);

router.post(
  '/send_verification_code',
  validateSchema(AuthValidation.send_verification_code),
  asyncWrapper(AuthController.send_verification_code),
);

router.post(
  '/change_password',
  validateSchema(AuthValidation.change_password),
  asyncWrapper(AuthController.change_password),
);

export default router;
