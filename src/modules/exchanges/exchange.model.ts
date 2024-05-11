import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';

export const supported_exchanges = [
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
];

export const network_supported = [
  'on-chain', 'lightning', 'sidechain', 'plasma', 'state-channels',
];

export const custody_options = ['custodial', 'non-custodial', 'hybrid'];
export const wallet_key_types = ['single-key', 'multi-key', 'hierarchical-deterministic'];
export const address_format = ['bech32', 'segwit', 'legacy', 'taproot'];
export const wallet_access = ['web', 'mobile', 'desktop', 'hardware', 'paper'];
export const mobile_os = ['android', 'ios'];
export const feature_meta = {
  buy: {
    fiat: ['yes', 'no'],
    credit_card: ['yes', 'no'],
    bank_transfer: ['yes', 'no'],
    crypto: ['yes', 'no'],
    p2p: ['yes', 'no'],
    fiat_pairs: ['yes', 'no'],
    fiat_withdrawal: ['yes', 'no'],
    fiat_deposit: ['yes', 'no'],
    fiat_conversion: ['yes', 'no'],
    crypto_pairs: ['yes', 'no'],
    crypto_withdrawal: ['yes', 'no'],
    crypto_deposit: ['yes', 'no'],
    crypto_conversion: ['yes', 'no'],
  },
};

export const available_countries = [
  'US', 'UK', 'NG', 'DE', 'FR', 'ZA', 'KE', 'GH', 'RW', 'TZ',
  'UG', 'ZM', 'ZW', 'CD', 'AO', 'MZ', 'ET', 'SD', 'CM', 'CI',
  'BF', 'NE', 'ML', 'SN', 'MR', 'TG', 'GH', 'BJ', 'GA', 'GQ',
  'CV', 'LR', 'SL', 'SH', 'ST', 'SC', 'MU', 'RE', 'YT', 'MW',
  'LS', 'BW', 'SZ', 'KM', 'DJ', 'ER', 'BI', 'MW', 'LS', 'BW',
  'SZ', 'KM', 'DJ', 'ER',
];

// Define the schema for the waitlist
const ExchangeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  twitter_handle: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  custody: {
    type: Array,
    enums: custody_options,
    required: false,
    default: [],
  },
  network_supported: {
    type: Array,
    enums: network_supported,
    required: false,
    default: [],
  },
  wallet_key_type: {
    type: Array,
    enums: wallet_key_types,
    required: false,
    default: [],
  },
  address_format: {
    type: Array,
    enums: address_format,
    required: false,
    default: [],
  },
  wallet_access: {
    type: Array,
    enums: wallet_access,
    required: false,
    default: [],
  },
  mobile_os: {
    type: Array,
    enums: mobile_os,
    required: false,
    default: [],
  },
  year_launched: {
    type: String,
    required: false,
    default: '',
  },
  year_closed: {
    type: String,
    required: false,
    default: '',
  },
  feature_meta: {
    type: Object,
    required: false,
    default: {},
  },
  available_countries: {
    type: Array,
    required: false,
    default: [],
  },
  is_active: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'exchanges',
});

// Create a model using the schema
const Exchange = dbConnections[MongoDBName.AppDB].model('exchanges', ExchangeSchema);

export default Exchange;
