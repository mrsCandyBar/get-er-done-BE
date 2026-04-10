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

const userSchema = new mongoose.Schema(
  {
    name: {
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
    achievements: {
      completed: {
        type: achievementBucketSchema,
        default: () => ({ task: [], fun: [], new: [] }),
      },
    },
    startedDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
    collection: 'users',
  }
);

module.exports = mongoose.model('User', userSchema);
