const mongoose = require('mongoose');

const getMongoUri = () => {
  if (process.env.NODE_ENV === 'test') {
    return (
      process.env.MONGODB_URI_TEST ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/_git-er-done-test'
    );
  }

  return (
    process.env.MONGODB_URI_DEV ||
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/_git-er-done'
  );
};

const connect = async () => {
  const uri = getMongoUri();
  await mongoose.connect(uri);
  console.log(`MongoDB connected (${process.env.NODE_ENV || 'development'}):`, uri);
};

module.exports = { connect, getMongoUri };
