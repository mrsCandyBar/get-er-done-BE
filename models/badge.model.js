const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
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
  gainedFrom: {
    type: String,
    required: true,
    trim: true,
  },
  physicalTrait: {
    icon: {
        value: String,
        width: Number,
        height: Number,
        textSizes: {
            round: Number,
            symbol: Number,
        },
    },
    label: {
        value: String,
        textSticker: [String],
        offset_round: Number,
        offset_round_full: Number,
        labelWidth: Number,
        labelHeight: Number,
        textSizes: {
            round: [Number, Number],
            text: [Number, Number],
        }
    },
    subtitle: {
        value: String,
        offset_round: Number,
        offset_round_full: Number,
        textSizes: {
            round: [Number, Number],
        }
    },
    color: {
        accent: String,
        contrast: String,
    }
  }
}, {
  timestamps: true,
  collection: 'badges',
});

module.exports = mongoose.model('Badge', badgeSchema);
