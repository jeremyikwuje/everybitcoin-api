/* eslint-disable func-names */
import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import { AdminRoles } from './user.enums';
import { Currency } from '../../constants';

// Define the schema for the waitlist
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  business_name: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  links: [{
    title: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  }],
  country: {
    type: String,
    required: false,
  },
  primary_currency: {
    type: String,
    default: Currency.USD,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    house_no: {
      type: String,
      required: false,
    },
    postal_code: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
  },
  is_investor: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_business: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_individual: {
    type: Boolean,
    required: false,
    default: true,
  },
  is_active: {
    type: Boolean,
    required: false,
    default: true,
  },
  is_email_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_phone_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  admin_role: {
    type: String,
    required: false,
    enum: Object.values(AdminRoles),
    default: AdminRoles.None,
  },
  verify_code: {
    type: String,
    required: false,
  },
  access_token: {
    token: {
      type: String,
      required: false,
    },
    expires: {
      type: Date,
      required: false,
    },
    timestamp: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  api_key: {
    type: String,
    required: false,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pricing',
    required: true,
  },
  usage: {
    credit_balance: {
      type: Number,
      required: false,
      default: 1000,
    },
    requests_made_since_history: {
      type: Number,
      required: false,
      default: 0,
    },
    requests_made_this_month: {
      type: Number,
      required: false,
      default: 0,
    },
    requests_made_this_day: {
      type: Number,
      required: false,
      default: 0,
    },
    requests_made_this_minute: {
      type: Number,
      required: false,
      default: 0,
    },
    failed_requests: {
      type: Number,
      required: false,
      default: 0,
    },
    last_request_timestamp: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  billing_cycle: {
    start_date: {
      type: Date,
      required: false,
    },
    end_date: {
      type: Date,
      required: false,
    },
    next_billing_date: {
      type: Date,
      required: false,
    },
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
  collection: 'users',
});

// Pre-save middleware to update the updated_at field
UserSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const User = dbConnections[MongoDBName.AppDB].model('users', UserSchema);

export default User;
