const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const mongoose = require('mongoose');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createPatchHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

const { buildUserPayload } = require('../payloads/buildUserPayload');
const { signUserToken } = require('../utils/jwt');
const authMiddleware = require('../utils/authMiddleware');

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

const buildUserSearchParams = (req) => {
  const id = req.params.id;
  return { _id: id === 'me' ? req.userId : id };
};


// Protect all routes below
router.use(authMiddleware);

router.get('/getAll', createGetAllHandler({
  model: User,
  buildSearchParams: () => ({}),
  sort: { updatedDate: -1, name: 1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: User,
  buildSearchParams: buildUserSearchParams,
  notFoundMessage: 'User not found'
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

    let user, isNewUser = false;
    if (existingUser) {
      user = await User.findByIdAndUpdate(
        existingUser._id,
        userProfile,
        { returnDocument: 'after', runValidators: true }
      );
    } else {
      const newUser = new User({
        ...userProfile,
        startedDate: userProfile.updatedDate,
        aspirations: { quest: [], fun: [], new: [] },
        achievements: [],
      });
      user = await newUser.save();
      isNewUser = true;
    }

    // Generate JWT token with userId
    const token = signUserToken(user);

    return res.status(isNewUser ? 201 : 200).json({
      message: 'Google login successful',
      isNewUser,
      user,
      token,
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
  buildSearchParams: buildUserSearchParams,
  buildUpdate: (req) => buildUserPayload(req.body),
  notFoundMessage: 'User not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: User,
  buildSearchParams: buildUserSearchParams,
  notFoundMessage: 'User not found',
  successMessage: 'User deleted successfully',
}));

// Add achievements to a user's achievements.recognised array
router.patch('/achievement/:userId/:achievementIndex', createPatchHandler({
  model: User,
  buildSearchParams: (req) => ({
    _id: req.params.userId,
    achievementIndex: Number(req.params.achievementIndex),
  }),
  buildUpdate: (req) => {
    const { achievementIds } = req.body || {};

    if (!Array.isArray(achievementIds) || achievementIds.length === 0) {
      const error = new Error('achievementIds must be a non-empty array of ObjectIds');
      error.status = 400;
      throw error;
    }

    return { achievementIds };
  },
  updateRecord: async (currentModel, searchParams, update) => {
    const user = await currentModel.findById(searchParams._id);

    if (!user) {
      return null;
    }

    const targetAchievement = user.achievements?.[searchParams.achievementIndex];
    if (!targetAchievement) {
      const error = new Error('Achievement entry not found for this user');
      error.status = 404;
      throw error;
    }

    const recognised = Array.isArray(targetAchievement.recognised)
      ? targetAchievement.recognised
      : [];
    const current = recognised.map((id) => id.toString());

    update.achievementIds.forEach((id) => {
      if (!current.includes(String(id))) {
        recognised.push(id);
      }
    });

    await user.save();
    return user;
  },
  notFoundMessage: 'User not found',
  buildSuccessPayload: (user) => ({ message: 'Achievements added to recognised', user }),
}));

// Update only the user's status
router.patch('/update-status/:id', createPatchHandler({
  model: User,
  buildSearchParams: buildUserSearchParams,
  buildUpdate: (req) => {
    const { status } = req.body || {};
    const allowedStatuses = ['friend', 'friend_new', 'friend_dear', 'friend_close', 'confidant'];

    if (!status || !allowedStatuses.includes(status)) {
      const error = new Error('Invalid status. Try another');
      error.status = 400;
      throw error;
    }

    return { status };
  },
  notFoundMessage: 'User not found',
  buildSuccessPayload: (user) => ({ message: 'Status updated successfully', user }),
}));

// Place this after all requires and router initialization, before authMiddleware
router.post('/refresh-token', async (req, res) => {
  const { userId, email } = req.body || {};
  if (!userId || !email) {
    return res.status(400).json({ message: 'userId and email are required' });
  }
  try {
    const user = await User.findOne({ _id: userId, email: String(email).toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = signUserToken(user);
    return res.status(200).json({
      message: 'Token refreshed',
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to refresh token' });
  }
});

module.exports = router;

