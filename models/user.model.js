const mongoose = require('mongoose');
const { nowIsoTimestamp } = require('../utils/dateTime');

const inspirationSchema = new mongoose.Schema(
  {
    inspirations: {
      type: String,
      trim: true,
      default: '',
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const achievementBucketSchema = new mongoose.Schema(
  {
    quest: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
    fun: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
    new: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    completed: {
      type: achievementBucketSchema,
      default: () => ({ quest: [], fun: [], new: [] }),
    },
    recognised: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Achievement',
      default: [],
    },
    createdAt: Date,
    completedAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    googleId: {
      type: String,
      trim: true,
      default: '',
    },
    profilePicture: {
      type: String,
      trim: true,
      default: '',
    },
    authProvider: {
      type: String,
      trim: true,
      default: '',
    },
    dob: {
      type: Date,
      default: null,
    },
    about: {
      type: String,
      trim: true,
      default: '',
    },
    inspirations: {
      type: [inspirationSchema],
      default: [],
    },
    progressUpdatePush: {
      schedule: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'monthly',
        trim: true,
      },
      lastUpdatedDate: {
        type: String,
        default: '',
        trim: true,
      },
      lastUpdateSent: {
        type: String,
        default: '',
        trim: true,
      },
      updatedDate: {
        type: String,
        default: '',
        trim: true,
      },
    },
    aspirations: {
      type: achievementBucketSchema,
      default: () => ({ quest: [], fun: [], new: [] }),
    },
    achievements: {
      type: [achievementSchema],
      default: [],
    },
    startedDate: {
      type: Date,
      default: nowIsoTimestamp,
    },
    updatedDate: {
      type: Date,
      default: nowIsoTimestamp,
    },
    lastLoginDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['friend', 'friend_new', 'friend_dear', 'friend_close', 'confidant'],
      default: 'friend',
      trim: true,
    },
  },
  {
    strict: false,
    collection: 'users',
  }
);

module.exports = mongoose.model('User', userSchema);
