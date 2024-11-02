import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import {
  address_format, custody_options, mobile_os, network_supported, wallet_access, wallet_key_types,
} from './exchange.enums';

// Define the schema for the waitlist
const ExchangeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    caseInsensitive: true,
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
