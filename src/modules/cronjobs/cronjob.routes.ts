import { Router } from 'express';
import * as CronjobController from './cronjob.controller';
import { asyncWrapper } from '../../utils/async-wrapper';

const router = Router();

router.post(
  '/update_exchange_rates_in_tickers',
  asyncWrapper(CronjobController.update_exchange_rates_in_tickers),
);

router.post(
  '/update_prices',
  asyncWrapper(CronjobController.save_prices),
);

router.post(
  '/update_tickers',
  asyncWrapper(CronjobController.update_tickers),
);

export default router;
