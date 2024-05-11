import dotenv from 'dotenv';

export enum MongoDBName {
  AppDB = 'app-db',
}

dotenv.config();

const Config = {
  env: process.env.NODE_ENV || 'testnet',
  port: process.env.PORT || 5000,
  publicUrl: String(process.env.PUBLIC_URL),
  mongooseDebug: process.env.DEBUG_MONGOOSE,
  db: [
    { name: MongoDBName.AppDB, uri: process.env.APP_DB },
  ],
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
};

export default Config;
