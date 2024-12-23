/* eslint-disable func-names */
import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import { Currency } from '../../constants';
import { BillingCycle } from './pricing.enums';

// Define the schema for the waitlist
const PricingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  requests_credit_per_month: {
    type: Number,
    required: true,
    default: 100,
  },
  requests_limit_per_month: {
    type: Number,
    required: true,
  },
  requests_limit_per_minute: {
    type: Number,
    default: 2,
  },
  price: {
    type: Number,
    required: true,
  },
  billing_cycle: {
    type: String,
    enum: Object.values(BillingCycle),
    required: true,
    default: BillingCycle.Monthly,
  },
  currency: {
    type: String,
    default: Currency.USD,
  },
  features: {
    supports_premium_currencies: {
      type: Boolean,
      default: false,
    },
    custom_reports: {
      type: Boolean,
      default: false,
    },
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
  collection: 'pricing',
});

// Pre-save middleware to update the updated_at field
PricingSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Pricing = dbConnections[MongoDBName.AppDB].model('pricing', PricingSchema);

export default Pricing;
