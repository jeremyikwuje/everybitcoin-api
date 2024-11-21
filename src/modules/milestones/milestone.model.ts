import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';
import { MilestoneType } from './milestone.enums';

// Define the schema for the milestone
const MilestoneSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enums: MilestoneType,
    default: MilestoneType.Price,
  },
  price: {
    type: Number,
    required: true,
    unique: true,
  },
  date_achieved: {
    type: Date,
    required: false,
  },
  market_cap: {
    type: Number,
    required: false,
  },
  days_from_previous: {
    type: Number,
    required: false,
  },
  is_future_target: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'milestones',
});

// Create a model using the schema
export const Milestone = dbConnections[MongoDBName.AppDB].model(
  'milestones',
  MilestoneSchema,
);
