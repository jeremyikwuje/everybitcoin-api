import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import TickerController from './ticker.controller';
import { TickerValidation } from './ticker.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.post(
  '/add_ticker',
  validateSchema(TickerValidation.add_ticker),
  asyncWrapper(TickerController.add_ticker),
);
router.post(
  '/activate_ticker',
  validateSchema(TickerValidation.activate_ticker),
  asyncWrapper(TickerController.activate_ticker),
);
router.post(
  '/deactivate_ticker',
  validateSchema(TickerValidation.deactivate_ticker),
  asyncWrapper(TickerController.deactivate_ticker),
);
router.post(
  '/delete_ticker',
  validateSchema(TickerValidation.delete_ticker),
  asyncWrapper(TickerController.delete_ticker),
);

router.get(
  '/get_ticker',
  validateSchema(TickerValidation.get_ticker),
  asyncWrapper(TickerController.get_ticker),
);

router.get(
  '/get_all_tickers',
  validateSchema(TickerValidation.get_all_tickers),
  asyncWrapper(TickerController.get_all_tickers),
);

router.get(
  '/get_ticker_exchanges',
  validateSchema(TickerValidation.get_ticker_exchanges),
  asyncWrapper(TickerController.get_ticker_exchanges),
);

router.post(
  '/update_ticker',
  validateSchema(TickerValidation.update_ticker),
  asyncWrapper(TickerController.update_ticker),
);

router.post(
  '/add_exchange_to_ticker',
  validateSchema(TickerValidation.add_exchange_to_ticker),
  asyncWrapper(TickerController.add_exchange_to_ticker),
);

router.post(
  '/remove_exchange_from_ticker',
  validateSchema(TickerValidation.remove_exchange_from_ticker),
  asyncWrapper(TickerController.remove_exchange_from_ticker),
);

router.post(
  '/update_exchange_in_ticker',
  validateSchema(TickerValidation.update_exchange_in_ticker),
  asyncWrapper(TickerController.update_exchange_in_ticker),
);

export default router;
