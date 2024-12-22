import mongoose from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';
import { FundingType } from '../funding.enums';

// Define the schema for the waitlist
const FundingTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
    enum: FundingType,
  },
  is_repayable: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'funding_types',
});

const FundingTypes = dbConnections[MongoDBName.AppDB].model('funding_types', FundingTypeSchema);

export default FundingTypes;
