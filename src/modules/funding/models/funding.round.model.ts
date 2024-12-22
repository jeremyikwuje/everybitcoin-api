import mongoose from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';
import { FundingRound, FundingType, RepaymentPeriod } from '../funding.enums';

// Define the schema for the waitlist
const FundingRoundsSchema = new mongoose.Schema({
  changer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'changers',
  },
  amount: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      default: 'USD',
    },
  },
  types: [{
    funding_type: {
      type: String,
      unique: true,
      required: true,
      enums: FundingType,
    },
  }],
  round: {
    type: String,
    required: false,
    enum: FundingRound,
  },
  message: {
    type: String,
    required: false,
    default: '',
  },
  special_message: {
    type: String,
    required: false,
    default: '',
  },
  investors: [{
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    lead: {
      type: Boolean,
      required: false,
      default: false,
    },
    comment: {
      type: String,
      required: false,
      default: '',
    },
  }],
  repayment_period: {
    type: String,
    required: false,
    enum: RepaymentPeriod,
  },
  return_rate: {
    type: Number,
    required: true,
    default: 0,
  },
  data_sources: [{
    source: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'sources',
    },
  }],
  is_published: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'funding_rounds',
});

const FundingRounds = dbConnections[MongoDBName.AppDB].model('funding_rounds', FundingRoundsSchema);

export default FundingRounds;
