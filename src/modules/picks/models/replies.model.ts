import mongoose from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';

// Define the schema for the waitlist
const PickReplySchema = new mongoose.Schema({
  pick: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'picks',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  liked_by: {
    type: Array,
    default: [],
    required: false,
  },
  dislikes: {
    type: Number,
    required: true,
    default: 0,
  },
  disliked_by: {
    type: Array,
    default: [],
    required: false,
  },
  reports: {
    type: Number,
    default: 0,
  },
  is_flagged: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PickReply',
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'pick_replies',
});

// Pre-save middleware to update the updated_at field
PickReplySchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const PickReply = dbConnections[MongoDBName.AppDB].model('pick_replies', PickReplySchema);

export default PickReply;
