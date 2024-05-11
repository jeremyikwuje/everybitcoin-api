import { Router } from 'express';
import { validate } from 'express-validation';
import { asyncWrapper } from '../../utils/async-wrapper';
import * as WaitlistController from './waitlist.controller';
import { WaitlistValidation } from './waitlist.validation';

const router = Router();

router.post(
  '/add_member',
  validate(WaitlistValidation.addMember),
  asyncWrapper(WaitlistController.add),
);

router.get(
  '/get_all_members',
  asyncWrapper(WaitlistController.getAllMembers),
);

export default router;
