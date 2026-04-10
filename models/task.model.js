const mongoose = require('mongoose');

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
    recur: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    completed: {
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskCategory',
      default: null,
    },
  },
  {
    strict: false,
    collection: 'tasks',
  }
);

module.exports = mongoose.model('Task', taskSchema);
