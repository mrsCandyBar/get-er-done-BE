const mongoose = require('mongoose');
const { nowIsoTimestamp } = require('../utils/dateTime');

const recurringTaskSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: {
    type: Date,
    default: nowIsoTimestamp,
  },
  updatedDate: {
    type: Date,
    default: nowIsoTimestamp,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  taskIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Task',
    default: [],
  },
}, {
  collection: 'recurring-tasks',
});

module.exports = mongoose.model('RecurringTask', recurringTaskSchema);
