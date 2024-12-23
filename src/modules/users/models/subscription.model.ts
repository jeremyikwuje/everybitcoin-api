/* eslint-disable func-names */
import { Schema, Document } from 'mongoose';
import { Currency } from '../../../constants';
import { SubscriptionStatus } from '../user.enums';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';
import { PaymentStatus } from '../../pricing/pricing.enums';

interface ISubscription extends Document {
  user: any;
  plan: any;
  units: number;
  amount: {
    unit: string;
    value: number;
  };
  start_date: Date;
  end_date: Date;
  status: SubscriptionStatus;
  reference: string;
  payment_channel: string;
  payment_status: PaymentStatus,
  payment_reference: string;
  payment_link: string;
  payment_expiry_date: Date;
  payment_made_date: Date;
  payment_attempts: number;
  payment_logs: any[];
  is_next_payment_ready: boolean;
  created_at: Date;
  updated_at: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: {
    unit: {
      type: String,
      default: Currency.USD,
      uppercase: true,
    },
    value: { type: Number, required: true },
  },
  plan: { type: String, required: true },
  units: {
    type: Number,
    required: true,
    default: 1,
  },
  start_date: { type: Date, required: false },
  end_date: { type: Date, required: false },
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.Inactive,
  },
  reference: { type: String, required: true, unique: true },
  payment_channel: { type: String, required: true },
  payment_status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.Unpaid,
  },
  payment_reference: { type: String, required: true, unique: true },
  payment_link: { type: String, required: false },
  payment_expiry_date: { type: Date, required: false },
  payment_made_date: { type: Date, required: false },
  payment_attempts: { type: Number, required: false, default: 0 },
  payment_logs: { type: [], required: false, default: [] },
  is_next_payment_ready: { type: Boolean, required: false, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'subscriptions',
});

SubscriptionSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Subscription = dbConnections[MongoDBName.AppDB].model<ISubscription>('subscriptions', SubscriptionSchema);

export default Subscription;
