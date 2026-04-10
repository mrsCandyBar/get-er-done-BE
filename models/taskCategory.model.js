const mongoose = require('mongoose');

const taskCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'task-categories',
  }
);

module.exports = mongoose.model('TaskCategory', taskCategorySchema);
