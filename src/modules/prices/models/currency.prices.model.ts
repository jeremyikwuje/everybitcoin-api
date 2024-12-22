/* eslint-disable func-names */
import { Schema, Document } from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';

interface ICurrencyPrices extends Document {
  base: string;
  quotes?: {
    [key: string]: number;
  };
  created_at: Date;
  updated_at: Date;
}

const CurrencyPricesSchema: Schema = new Schema({
  base: { type: String, required: true, unique: true },
  quotes: { type: Map, of: Number, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'currency_rates',
});

// Pre-save middleware to update the updated_at field
CurrencyPricesSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const CurrencyPrices = dbConnections[MongoDBName.AppDB].model<ICurrencyPrices>('currency_prices', CurrencyPricesSchema);

export default CurrencyPrices;
