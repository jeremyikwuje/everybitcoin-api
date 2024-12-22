import mongoose from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';
import { supported_markets } from '../../../constants';

// Define the schema for the waitlist
const PriceSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  market: {
    type: String,
    enum: supported_markets,
    required: true,
    trim: true,
  },
  exchange: {
    type: String,
    required: true,
    default: 'host',
  },
}, {
  timestamps: true,
  collection: 'prices',
});

// Create a model using the schema
const Price = dbConnections[MongoDBName.AppDB].model('prices', PriceSchema);

export default Price;
