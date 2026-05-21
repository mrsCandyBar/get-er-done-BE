const mongoose = require('mongoose');
const { nowIsoTimestamp } = require('../utils/dateTime');

const taskCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    achievements: {
      completed: {
        type: Number,
        default: 0,
        min: 0,
      },
      busy: {
        type: Number,
        default: 0,
        min: 0,
      },
      waiting: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: { currentTime: nowIsoTimestamp },
    strict: false,
    collection: 'task-categories',
  }
);

module.exports = mongoose.model('TaskCategory', taskCategorySchema);
