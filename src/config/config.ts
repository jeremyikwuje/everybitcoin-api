import dotenv from 'dotenv';

export enum MongoDBName {
  AppDB = 'app-db',
}

dotenv.config();

const Config = {
  env: process.env.NODE_ENV || 'testnet',
  enableCronJobs: process.env.ENABLE_CRON_JOBS === 'true',
  port: process.env.PORT || 5000,
  app_name: process.env.APP_NAME || 'Everybitcoin',
  publicUrl: String(process.env.PUBLIC_URL),
  mongooseDebug: process.env.DEBUG_MONGOOSE,
  db: [
    { name: MongoDBName.AppDB, uri: process.env.APP_DB },
  ],
  default_cost_per_request: 1,
  default_pricing_code: 'free',
  jwtSecret: String(process.env.JWT_SECRET),
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || '',
  },
  noones: {
    CLIENT_ID: process.env.NOONES_CLIENT_ID,
    CLIENT_SECRET: process.env.NOONES_CLIENT_SECRET,
  },
  exchanges: [
    'binance',
    'bybit',
    'bitget',
    'bitfinix',
    'blockchain',
    'bitstamp',
    'bithumb',
    'bitmart',
    'bitso',
    'bisq',
    'coinmarketcap',
    'coingecko',
    'coinbase',
    'coinmama',
    'etoro',
    'gemini',
    'htx_houbi',
    'kraken',
    'kucoin',
    'noones',
    'okx',
    'robinhood',
    'uphold',
  ],
  trusted_exchanges: [
    'binance',
    'coinbase',
    'bitfinex',
    'luno',
    'okx',
    'kraken',
  ],
  mailgun: {
    domain: process.env.MAILGUN_DOMAIN || '',
    api_key: process.env.MAILGUN_API_KEY || '',
  },
  paystack: {
    base_url: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
    secret_key: process.env.PAYSTACK_SECRET_KEY || '',
    webhook_key: process.env.PAYSTACK_WEBHOOK_KEY || '',
  },
  flutterwave: {
    base_url: process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3',
    secret_key: process.env.FLUTTERWAVE_SECRET_KEY || '',
    webhook_key: process.env.FLUTTERWAVE_WEBHOOK_KEY || '',
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY || '',
  },
  xe: {
    access_key: process.env.XE_ACCESS_KEY,
  },
};

export default Config;
