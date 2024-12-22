import mongoose from 'mongoose';
import dbConnections from '../../database';
import { MongoDBName } from '../../config/config';

// Define the schema for the waitlist
const SourcesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  trust_score: {
    type: Number,
    required: false,
    default: 0,
  },
  icon: {
    type: String,
    required: false,
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_primary: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_active: {
    type: Boolean,
    required: false,
    default: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: false,
  collection: 'sources',
});

const Source = dbConnections[MongoDBName.AppDB].model('sources', SourcesSchema);

export default Source;
