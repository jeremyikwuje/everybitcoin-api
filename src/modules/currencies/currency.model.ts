import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';

export const currency_codes = [
  'USD', 'EUR', 'GBP', 'NGN', 'AUD', 'JPY', 'AED', 'CNY', 'CAD', 'ZAR',
  'INR', 'RUB', 'BRL', 'TRY', 'KRW', 'SGD', 'CHF', 'SEK', 'NOK', 'MXN',
  'IDR', 'MYR', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'GHS', 'KES', 'UGX',
  'ZMW', 'TZS', 'RWF', 'MAD', 'EGP', 'PKR', 'BDT', 'VND', 'PHP', 'THB',
  'LKR', 'NPR', 'IQD', 'JOD', 'CZK', 'HUF', 'PLN', 'DKK', 'ISK', 'HRK',
  'RON', 'BGN', 'TRY', 'UAH', 'ILS', 'NZD', 'CLP', 'COP', 'PEN', 'ARS',
  'VEF', 'BOB', 'UYU', 'PYG', 'CRC', 'GTQ', 'HNL', 'NIO', 'DOP', 'JMD',
  'TTD', 'XCD', 'BBD', 'BSD', 'BZD', 'KYD', 'XCD', 'XCD', 'ANG', 'AWG',
  'SRD', 'GYD', 'VES', 'HTG', 'CUP', 'CUC', 'SVC', 'NAD', 'MZN', 'AOA',
  'ZWL', 'ZMW', 'ZAR', 'MUR', 'MGA', 'KES', 'GHS', 'ETB', 'DZD', 'TND',
  'LYD', 'SDG', 'SSP', 'SOS', 'GMD', 'SCR', 'MRO', 'CVE', 'XAF',
];

// Define the schema for the waitlist
const CurrencySchema = new mongoose.Schema({
  code: {
    type: String,
    enums: currency_codes,
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
  icon: {
    type: String,
    required: false,
    default: '',
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
