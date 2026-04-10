const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/get-er-done';
  await mongoose.connect(uri);
  console.log('MongoDB connected:', uri);
};

module.exports = { connect };
