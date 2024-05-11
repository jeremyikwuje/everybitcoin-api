import { Router } from 'express';
import * as CronjobController from './cronjob.controller';
import { asyncWrapper } from '../../utils/async-wrapper';

const router = Router();

router.post(
  '/update_btc_usd_ticker',
  asyncWrapper(CronjobController.update_btc_usd_ticker),
);

export default router;
