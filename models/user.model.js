const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
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
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'users',
  }
);

module.exports = mongoose.model('User', userSchema);
