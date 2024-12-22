import mongoose from 'mongoose';
import dbConnections from '../../../database';
import { MongoDBName } from '../../../config/config';
import { PickStatus, PickType, PickVisibility } from '../picks.enums';

// Define the schema for the waitlist
const PickSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(PickType),
    default: PickType.Pick,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  featured_image: {
    type: String,
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sources',
    required: true,
  },
  source_name: {
    type: String,
    required: true,
  },
  content_type: {
    type: Array,
    required: true,
  },
  visibility: {
    type: String,
    enum: Object.values(PickVisibility),
    default: PickVisibility.Public,
  },
  is_published: {
    type: Boolean,
    required: true,
    default: false,
  },
  picked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  approval_status: {
    type: String,
    enum: Object.values(PickStatus),
    default: PickStatus.Pending,
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
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  clicked_by: {
    type: Array,
    default: [],
    required: false,
  },
  reports: {
    type: Number,
    default: 0,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'picks',
});

// Pre-save middleware to update the updated_at field
PickSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Pick = dbConnections[MongoDBName.AppDB].model('picks', PickSchema);

export default Pick;
