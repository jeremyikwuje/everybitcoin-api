import httpStatus from 'http-status';
import APIError from '../utils/api-error';
import { SubscriptionPlans } from '../modules/pricing/pricing.enums';

export const plan_access = (required_plans: string[]) => (req: any, res: any, next: any) => {
  if (!required_plans || required_plans.length === 0) {
    return next();
  }

  const { user } = req;
  if (!user) {
    return next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED));
  }

  if (user.role === SubscriptionPlans.Power) {
    next();
    return true;
  }

  const hasRole = required_plans.some((plan) => user.plan === plan);
  if (!hasRole) {
    return next(
      new APIError(
        "You're not allowed to access this resource",
        httpStatus.FORBIDDEN,
      ),
    );
  }

  next();
  return true;
};
