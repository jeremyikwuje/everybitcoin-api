import { Router } from 'express';
import { asyncWrapper } from '../../utils/async-wrapper';
import CurrencyController from './currency.controller';
import { CurrencyValidation } from './currency.validation';
import validateSchema from '../../middlewares/validate-schema.middleware';

const router = Router();

router.post(
  '/add_currency',
  validateSchema(CurrencyValidation.add_currency),
  asyncWrapper(CurrencyController.add_currency),
);

router.get(
  '/get_currency',
  validateSchema(CurrencyValidation.get_currency),
  asyncWrapper(CurrencyController.get_currency),
);
router.get(
  '/get_all_currencies',
  asyncWrapper(CurrencyController.get_all_currencies),
);

router.post(
  '/update_currency',
  validateSchema(CurrencyValidation.update_currency),
  asyncWrapper(CurrencyController.update_currency),
);

router.post(
  '/delete_currency',
  validateSchema(CurrencyValidation.delete_currency),
  asyncWrapper(CurrencyController.delete_currency),
);

export default router;
