import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import { CurrencyE } from './currencies.data';

// Define the schema for the waitlist
const CurrencySchema = new mongoose.Schema({
  code: {
    type: String,
    enums: Object.values(CurrencyE),
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  denomination: {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    singular: {
      type: String,
      required: true,
      trim: true,
    },
    plural: {
      type: String,
      required: true,
      trim: true,
    },
    divisor: {
      type: Number,
      required: true,
      default: 2,
    },
  },
  icon: {
    type: String,
    required: false,
    default: '',
  },
  decimals: {
    type: Number,
    required: true,
    default: 2,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'currencies',
});

// Create a model using the schema
const Currency = dbConnections[MongoDBName.AppDB].model('currencies', CurrencySchema);

export default Currency;
