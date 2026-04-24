const mongoose = require('mongoose');

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
    task: {
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
      type: [String],
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
      type: String,
      trim: true,
      default: '',
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
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    lastLoginDate: {
      type: Date,
      default: null,
    },
  },
  {
    strict: false,
    collection: 'users',
  }
);

module.exports = mongoose.model('User', userSchema);
