import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import ExchangeController from './exchange.controller';
import { ExchangeValidation } from './exchange.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.post(
  '/add_exchange',
  validateSchema(ExchangeValidation.add_exchange),
  asyncWrapper(ExchangeController.add_exchange),
);
router.post(
  '/activate_exchange',
  validateSchema(ExchangeValidation.activate_exchange),
  asyncWrapper(ExchangeController.activate_exchange),
);
router.post(
  '/deactivate_exchange',
  validateSchema(ExchangeValidation.deactivate_exchange),
  asyncWrapper(ExchangeController.deactivate_exchange),
);
router.post(
  '/delete_exchange',
  validateSchema(ExchangeValidation.delete_exchange),
  asyncWrapper(ExchangeController.delete_exchange),
);

router.get(
  '/get_exchange',
  validateSchema(ExchangeValidation.deactivate_exchange),
  asyncWrapper(ExchangeController.get_exchange),
);
router.get(
  '/get_all_exchanges',
  asyncWrapper(ExchangeController.get_all_exchanges),
);

router.post(
  '/update_exchange',
  validateSchema(ExchangeValidation.update_exchange),
  asyncWrapper(ExchangeController.update_exchange),
);

export default router;
