const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');
const { buildUserPayload } = require('../payloads/buildUserPayload');

const verifyGoogleIdToken = async (idToken) => {
  if (typeof globalThis.fetch !== 'function') {
    const error = new Error('Fetch API is not available in this Node environment');
    error.status = 500;
    throw error;
  }

  const response = await globalThis.fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.error_description || payload.error || 'Invalid Google sign-in token');
    error.status = 401;
    throw error;
  }

  if (String(payload.email_verified).toLowerCase() !== 'true') {
    const error = new Error('Google account email is not verified');
    error.status = 401;
    throw error;
  }

  const expectedAudience = process.env.GOOGLE_CLIENT_ID;
  if (expectedAudience && payload.aud && payload.aud !== expectedAudience) {
    const error = new Error('Google token audience does not match this application');
    error.status = 401;
    throw error;
  }

  return payload;
};

const buildGoogleUserProfile = (googlePayload = {}) => {
  const email = googlePayload.email ? String(googlePayload.email).trim().toLowerCase() : '';
  const fallbackName = [googlePayload.given_name, googlePayload.family_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const now = new Date();

  return {
    name: String(googlePayload.name || fallbackName || email.split('@')[0] || 'Google User').trim(),
    email,
    googleId: googlePayload.sub ? String(googlePayload.sub) : '',
    profilePicture: googlePayload.picture ? String(googlePayload.picture) : '',
    authProvider: 'google',
    updatedDate: now,
    lastLoginDate: now,
  };
};

router.get('/getAll', createGetAllHandler({
  model: User,
  buildSearchParams: () => ({}),
  sort: { updatedDate: -1, name: 1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
}));

router.post('/create', createCreateHandler({
  model: User,
  buildPayload: (req) => buildUserPayload(req.body),
}));

router.post('/login/google', async (req, res) => {
  const { idToken } = req.body || {};

  if (!idToken) {
    return res.status(400).json({ message: 'Google idToken is required' });
  }

  try {
    const googlePayload = await verifyGoogleIdToken(idToken);
    const userProfile = buildGoogleUserProfile(googlePayload);
    const existingUser = await User.findOne({
      $or: [
        { googleId: userProfile.googleId },
        { email: userProfile.email },
      ],
    });

    if (existingUser) {
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        userProfile,
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        message: 'Google login successful',
        isNewUser: false,
        user: updatedUser,
      });
    }

    const newUser = new User({
      ...userProfile,
      startedDate: userProfile.updatedDate,
      aspirations: { task: [], fun: [], new: [] },
      achievements: [],
    });
    const createdUser = await newUser.save();

    return res.status(201).json({
      message: 'Google login successful',
      isNewUser: true,
      user: createdUser,
    });
  } catch (error) {
    const status = error.status || 500;

    return res.status(status).json({
      message: error.message || 'Google login failed',
    });
  }
});

router.put('/update/:id', createUpdateHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildUserPayload(req.body),
  notFoundMessage: 'User not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
  successMessage: 'User deleted successfully',
}));

module.exports = router;
