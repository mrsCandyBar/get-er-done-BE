// utils/authMiddleware.js
const { verifyUserToken } = require('./jwt');

function authMiddleware(req, res, next) {
  // Whitelist of unprotected routes (add more as needed)
  const unprotected = [
    '/api/users/login/google',
    '/api/users/create',
    '/api/users/refresh-token',
  ];
  // Allow unprotected routes through
  if (unprotected.includes(req.originalUrl) || unprotected.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyUserToken(token);
    req.userId = payload.userId;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
