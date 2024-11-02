import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import { ticker_symbols } from './ticker.enums';

// Define the schema for the waitlist
const TickerSchema = new mongoose.Schema({
  symbol: {
    type: String,
    enums: ticker_symbols,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
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
        price_buy: {
          type: Number,
          required: false,
          default: 0,
        },
        price_sell: {
          type: Number,
          required: false,
          default: 0,
        },
        price_1hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_1hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_24hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_24hr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_7d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_7d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_30d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_30d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_90d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_90d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_180d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_180d: {
          type: Number,
          required: false,
          default: 0,
        },
        price_1yr: {
          type: Number,
          required: false,
          default: 0,
        },
        price_change_percent_1yr: {
          type: Number,
          required: false,
          default: 0,
        },
        updated_at: {
          type: Date,
          required: false,
          default: Date.now,
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
  price_30min: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_30min: {
    type: Number,
    required: true,
    default: 0,
  },
  price_1hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_1hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_24hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_24hr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_7d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_7d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_30d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_30d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_60d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_60d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_90d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_90d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_180d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_180d: {
    type: Number,
    required: true,
    default: 0,
  },
  price_1yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_1yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_2yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_2yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_3yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_3yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_5yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_change_percent_5yr: {
    type: Number,
    required: true,
    default: 0,
  },
  price_10yr: {
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
const Ticker = dbConnections[MongoDBName.AppDB].model(
  'tickers',
  TickerSchema,
);

export default Ticker;
