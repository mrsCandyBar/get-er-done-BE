// utils/jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = '7d'; // 7 days

function signUserToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyUserToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signUserToken,
  verifyUserToken,
};
