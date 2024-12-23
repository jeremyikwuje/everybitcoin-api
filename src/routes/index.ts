import { Router, Request, Response } from 'express';
import WaitlistRoutes from '../modules/waitlist/waitlist.routes';
import ExchangeRoutes from '../modules/exchanges/exchange.routes';
import TickerRoutes from '../modules/tickers/ticker.routes';
import CurrencyRoutes from '../modules/currencies/currency.routes';
import CronjobRoutes from '../modules/cronjobs/cronjob.routes';
import MilestoneRoutes from '../modules/milestones/milestone.routes';
import PriceRoutes from '../modules/prices/price.routes';
import PickRoutes from '../modules/news/picks.routes';
import SourceRoutes from '../modules/sources/source.routes';
import FundingRoutes from '../modules/funding/funding.routes';
import UserRoutes from '../modules/users/user.routes';
import AuthRoutes from '../modules/auth/auth.routes';

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
  '/prices',
  PriceRoutes,
);

router.use(
  '/milestones',
  MilestoneRoutes,
);

router.use(
  '/picks',
  PickRoutes,
);

router.use(
  '/cronjobs',
  CronjobRoutes,
);

router.use(
  '/sources',
  SourceRoutes,
);

router.use(
  '/funding',
  FundingRoutes,
);

router.use(
  '/users',
  UserRoutes,
);

router.use(
  '/auth',
  AuthRoutes,
);

export default router;
