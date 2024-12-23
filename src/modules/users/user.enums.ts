import { Channel, Currency } from '../../constants';
import { PaymentStatus } from '../pricing/pricing.enums';

export interface IUser {
  _id?: string;
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  business_name?: string;
  avatar?: string;
  links?: {
    title: string;
    url: string;
  }[];
  country?: string;
  phone_number?: string;
  address?: {
    street?: string;
    house_no?: string;
    postal_code?: string;
    city?: string;
    state?: string;
  };
  is_investor?: boolean;
  is_business?: boolean;
  is_individual?: boolean;
  is_active?: boolean;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  verify_code?: string;
  access_token?: {
    token: string;
    expires: Date;
    timestamp: number,
  };
  plan?: any;
  usage?: IUserUsage;
}

export interface IUserUsage {
  credit_balance: number;
  requests_made_since_history: number;
  requests_made_this_month?: number;
  requests_made_this_day?: number;
  requests_made_this_minute?: number;
  failed_requests: number;
  last_request_timestamp?: Date;
  request_limit_per_minute?: number;
}

export interface INewUser {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  country?: string;
  is_investor?: boolean;
  is_business?: boolean;
  is_individual?: boolean;
  plan?: any;
  usage?: IUserUsage;
}

export enum AdminRoles {
  None = 'none',
  Partner = 'partner',
  Board = 'board',
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Manager = 'manager',
  Editor = 'editor',
  Explorer = 'explorer',
}

export enum SubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  Cancelled = 'cancelled',
  Expired = 'expired',
}

export interface INewSubscription {
  user: any;
  amount: {
    unit: string;
    value: number;
  };
  plan: any;
  units: number;
  start_date?: Date;
  end_date?: Date;
  status: SubscriptionStatus;
  reference: string;
  payment_channel: string;
  payment_status: PaymentStatus,
  payment_reference: string;
  payment_link?: string;
  payment_expiry_date: Date;
  payment_made_date?: Date;
  payment_attempts?: number;
  payment_logs?: any[];
  created_at?: Date;
  updated_at?: Date;
}

export interface ISubscription {
  user: any;
  amount?: {
    unit: string;
    value: number;
  };
  plan?: any;
  units?: number;
  start_date?: Date;
  end_date?: Date;
  status?: SubscriptionStatus;
  reference?: string;
  payment_channel?: string;
  payment_status?: PaymentStatus,
  payment_reference?: string;
  payment_link?: string;
  payment_expiry_date?: Date;
  payment_made_date?: Date;
  payment_attempts?: number;
  payment_logs?: any[];
  is_next_payment_ready?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IPaymentInfo {
  amount: number,
  reference: string,
  channel: Channel,
  channel_reference?: string,
  redirect_url: string,
  title: string,
  description?: string,
  currency: Currency,
  customer: {
    email: string,
    name?: string,
  },
  checkout_link?: string,
}
