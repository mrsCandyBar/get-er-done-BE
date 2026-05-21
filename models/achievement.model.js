const mongoose = require('mongoose');
const { nowIsoTimestamp } = require('../utils/dateTime');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
  },
  goal: {
    type: [String],
    required: true,
    default: [],
  },
  gainedFrom: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: { currentTime: nowIsoTimestamp },
  collection: 'achievements',
});

module.exports = mongoose.model('Achievement', achievementSchema);
