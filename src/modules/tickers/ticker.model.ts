import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';

export const ticker_symbols = [
  'btc-usd', // United States
  'btc-eur', // European Union
  'btc-jpy', // Japan
  'btc-gbp', // United Kingdom
  'btc-aud', // Australia
  'btc-cad', // Canada
  'btc-cny', // China
  'btc-inr', // India
  'btc-brl', // Brazil
  'btc-zar', // South Africa
  'btc-try', // Turkey
  'btc-chf', // Switzerland
  'btc-sek', // Sweden
  'btc-nzd', // New Zealand
  'btc-pln', // Poland
  'btc-ngn', // Nigeria
  'btc-ars', // Argentina
  'btc-nok', // Norway
  'btc-twd', // Taiwan
  'btc-egp', // Egypt
  'btc-cop', // Colombia
  'btc-thb', // Thailand
  'btc-myr', // Malaysia
  'btc-clp', // Chile
  'btc-pkr', // Pakistan
  'btc-ron', // Romania
  'btc-czk', // Czech Republic
  'btc-php', // Philippines
  'btc-vnd', // Vietnam
  'btc-bdt', // Bangladesh
  'btc-huf', // Hungary
  'btc-per', // Peru
  'btc-ghs', // Ghana
  'btc-ils', // Israel
  'btc-dkk', // Denmark
  'btc-kwd', // Kuwait
  'btc-qar', // Qatar
  'btc-omr', // Oman
  'btc-bhd', // Bahrain
  'btc-aed', // United Arab Emirates
  'btc-sgd', // Singapore
  'btc-hkd', // Hong Kong
  'btc-uah', // Ukraine
  'btc-kes', // Kenya
  'btc-ugx', // Uganda
];

// Define the schema for the waitlist
const TickerSchema = new mongoose.Schema({
  symbol: {
    type: String,
    enums: ticker_symbols,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: false,
  },
  exchanges: {
    type: [
      {
        code: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        price: {
          type: Number,
          required: false,
          default: 0,
        },
        price_sell: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_24hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_24hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_7d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_7d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_30d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_30d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_90d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_90d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_180d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_180d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_1yr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_1yr: {
          type: Number,
          required: false,
          default: 0,
        },
      },
    ],
    required: true,
    default: {},
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_30min: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_30min: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_1hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_1hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_24hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_24hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_7d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_7d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_30d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_30d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_60d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_60d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_90d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_90d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_180d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_180d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_1yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_1yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_2yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_2yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_3yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_3yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_5yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_5yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_10yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_10yr: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'tickers',
});

// Create a model using the schema
const Ticker = dbConnections[MongoDBName.AppDB].model('tickers', TickerSchema);

export default Ticker;
