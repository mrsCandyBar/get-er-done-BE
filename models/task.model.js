const mongoose = require('mongoose');

const completedSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      trim: true,
      default: '',
    },
    completedDate: {
      type: Date,
      default: null,
    },
    finalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    recur: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    startedDate: {
      type: Date,
      default: null,
    },
    updatedDate: {
      type: Date,
      default: null,
    },
    recur: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    completed: {
      type: completedSchema,
      default: undefined,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskCategory',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    strict: false,
    collection: 'tasks',
  }
);

module.exports = mongoose.model('Task', taskSchema);
