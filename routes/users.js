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

const buildUserPayload = (body = {}) => {
  const payload = {};

  if (body.name != null || body.displayName != null || body.username != null) {
    payload.name = String(body.name ?? body.displayName ?? body.username);
  }

  if (body.dob != null) {
    payload.dob = new Date(body.dob);
  }

  if (body.about != null) {
    payload.about = String(body.about);
  }

  if (Array.isArray(body.inspirations)) {
    payload.inspirations = body.inspirations.map((item = {}) => ({
      inspirations: item.inspirations != null ? String(item.inspirations) : '',
      reason: item.reason != null ? String(item.reason) : '',
      url: item.url != null ? String(item.url) : '',
    }));
  }

  if (body.progressUpdatePush != null) {
    payload.progressUpdatePush = String(body.progressUpdatePush);
  }

  if (body.achievements && typeof body.achievements === 'object') {
    const achievements = {};

    if (body.achievements.completed && typeof body.achievements.completed === 'object') {
      achievements.completed = {
        task: Array.isArray(body.achievements.completed.task)
          ? [...body.achievements.completed.task]
          : [],
        fun: Array.isArray(body.achievements.completed.fun)
          ? [...body.achievements.completed.fun]
          : [],
        new: Array.isArray(body.achievements.completed.new)
          ? [...body.achievements.completed.new]
          : [],
      };
    }

    payload.achievements = achievements;
  }

  if (body.startedDate != null) {
    payload.startedDate = new Date(body.startedDate);
  }

  if (body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  return payload;
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
