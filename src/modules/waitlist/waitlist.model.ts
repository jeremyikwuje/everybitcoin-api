import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';

// Define the schema for the waitlist
const WaitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'waitlists',
  },
  rewardEarned: {
    type: Number,
    default: 0,
  },
  ip: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  device: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
  collection: 'waitlists',
});

// Create a virtual field to calculate the count of referrals
WaitlistSchema.virtual('referralCount', {
  ref: 'waitlists',
  localField: '_id',
  foreignField: 'referredBy',
  count: true,
});

// Create a model using the schema
const Waitlist = dbConnections[MongoDBName.AppDB].model('waitlists', WaitlistSchema);

export default Waitlist;
