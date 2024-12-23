export interface IPricing {
  name?: string;
  code?: string;
  price?: number;
  billing_cycle?: string;
  requests_limit_per_month?: number;
  requests_limit_per_minute?: number;
  is_active?: boolean;
}

export enum BillingCycle {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum PaymentStatus {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

export enum SubscriptionPlans {
  Free = 'free',
  Lite = 'lite',
  Basic = 'basic',
  Standard = 'standard',
  Essential = 'essential',
  Power = 'power',
}
