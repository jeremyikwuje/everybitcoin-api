import { Router, Request, Response } from 'express';
import WaitlistRoutes from '../modules/waitlist/waitlist.routes';
import ExchangeRoutes from '../modules/exchanges/exchange.routes';
import TickerRoutes from '../modules/tickers/ticker.routes';
import CurrencyRoutes from '../modules/currencies/currency.routes';
import CronjobRoutes from '../modules/cronjobs/cronjob.routes';
import MilestoneRoutes from '../modules/milestones/milestone.routes';

const router = Router();

router.use(
  '/health-check',
  (req: Request, res: Response) => res.send('OK'),
);

router.use(
  '/waitlist',
  WaitlistRoutes,
);

router.use(
  '/exchanges',
  ExchangeRoutes,
);

router.use(
  '/tickers',
  TickerRoutes,
);

router.use(
  '/currencies',
  CurrencyRoutes,
);

router.use(
  '/milestones',
  MilestoneRoutes,
);

router.use(
  '/cronjobs',
  CronjobRoutes,
);

export default router;
