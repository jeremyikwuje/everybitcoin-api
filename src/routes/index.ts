import { Router, Request, Response } from 'express';
import waitlistRouter from '../modules/waitlist/waitlist.routes';

const router = Router();

router.use(
  '/health-check',
  (req: Request, res: Response) => res.send('OK'),
);

router.use(
    '/waitlist',
    waitlistRouter,
)

export default router;
