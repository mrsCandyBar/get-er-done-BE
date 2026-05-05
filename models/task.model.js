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
    keepsakeUrl: {
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

const checklistSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: '',
    },
    updateDate: Date,
    checked: {
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
    recurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecurringTask',
      default: null,
    },
    state: {
      type: String,
      enum: ['waiting', 'busy', 'complete'],
      default: 'waiting',
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
    checklist: {
      type: [checklistSchema],
      default: [],
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
