export const supported_markets = ['exchanges', 'mid-market', 'bank'];

export const CountryCodeByCurrency: any = {
  USD: 'US',
  EUR: ['DE', 'AD', 'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'MC', 'NL', 'PT', 'SM', 'SK', 'SI', 'ES', 'VA'],
  JPY: 'JP',
  GBP: 'GB',
  AUD: 'AU',
  CAD: 'CA',
  CHF: 'CH',
  CNY: 'CN',
  SEK: 'SE',
  NZD: 'NZ',
  KRW: 'KR',
  SGD: 'SG',
  NOK: 'NO',
  MXN: 'MX',
  INR: 'IN',
  RUB: 'RU',
  ZAR: 'ZA',
  HKD: 'HK',
  BRL: 'BR',
  IDR: 'ID',
  MYR: 'MY',
  PHP: 'PH',
  DKK: 'DK',
  CZK: 'CZ',
  HUF: 'HU',
  ILS: 'IL',
  PLN: 'PL',
  THB: 'TH',
  TRY: 'TR',
  AED: 'AE',
  ARS: 'AR',
  CLP: 'CL',
  COP: 'CO',
  EGP: 'EG',
  KES: 'KE',
  KWD: 'KW',
  MAD: 'MA',
  PEN: 'PE',
  PKR: 'PK',
  QAR: 'QA',
  SAR: 'SA',
  TWD: 'TW',
  VND: 'VN',
  NGN: 'NG',
  UAH: 'UA',
};

export const threeCountryCodeByCurrency: any = {
  NGN: 'NGA',
  KES: 'KEN',
  USD: 'USA',
  EUR: ['FRA', 'BEL'],
  GBP: 'GBR',
  CAD: 'CAN',
  AUD: 'AUS',
  JPY: 'JPN',
};

export enum Currency {
  BTC = 'BTC',
  USDT = 'USDT',
  USDC = 'USDC',
  JPY = 'JPY',
  USD = 'USD',
}

export enum CurrencyType {
  fiat = 'fiat',
  bitcoin = 'bitcoin',
  crypto = 'crypto',
}

export const Currencies = [
  {
    name: 'Bitcoin',
    code: Currency.BTC,
    type: CurrencyType.bitcoin,
    decimal: 8,
    denomination: 'Satoshi',
    denomination_plural: 'Satoshis',
    denomination_short: 'SAT',
    denomination_divisor: 100000000,
  },
  {
    name: 'Tether',
    code: Currency.USDT,
    type: CurrencyType.crypto,
    decimal: 2,
    denomination: 'Cent',
    denomination_plural: 'Cents',
    denomination_short: '¢',
    denomination_divisor: 100,
  },
  {
    name: 'USD Coin',
    code: Currency.USDC,
    type: CurrencyType.crypto,
    decimal: 2,
    denomination: 'Cent',
    denomination_plural: 'Cents',
    denomination_short: '¢',
    denomination_divisor: 100,
  },
  {
    name: 'US Dollar',
    code: Currency.USD,
    type: CurrencyType.fiat,
    decimal: 2,
    denomination: 'Cent',
    denomination_plural: 'Cents',
    denomination_short: '¢',
    denomination_divisor: 100,
  },
  {
    name: 'Japanese Yen',
    code: Currency.JPY,
    type: CurrencyType.fiat,
    decimal: 0,
    denomination: 'Sen',
    denomination_plural: 'Sen',
    denomination_short: 'Sen',
    denomination_divisor: 1,
  },
];

export const ERROR_CODE = 400;
export const ERROR_MESSAGE = 'Request error';

export enum Channel {
  Paystack = 'paystack',
  Flutterwave = 'flutterwave',
  Stripe = 'stripe',
  OpenNode = 'opennode',
  NowPayments = 'nowpayments',
  Binance = 'binance',
}

export enum RequestState {
  Awaiting = 'awaiting',
  Created = 'created',
  Pending = 'pending',
  Processing = 'processing',
  Onhold = 'on-hold',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Successful = 'successful',
}

export interface PaymentChannelResponse {
  status: RequestState
  amount: number,
  channel_reference: string,
  channel_response: any,
}

export interface PaymentCheckoutResponse {
  link: string;
  reference: string;
}
