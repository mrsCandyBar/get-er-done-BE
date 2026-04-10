const express = require('express');
const router = express.Router();
const TaskCategory = require('../models/taskCategory.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

const buildTaskCategoryPayload = (body = {}) => {
  const payload = {};

  if (body.name != null) payload.name = String(body.name);
  if (body.count != null) payload.count = Number(body.count);
  if (body.description != null) payload.description = String(body.description);

  if (body.achievements && typeof body.achievements === 'object') {
    const achievements = {};

    if (body.achievements.completed != null) {
      achievements.completed = Number(body.achievements.completed);
    }

    if (body.achievements.busy != null) {
      achievements.busy = Number(body.achievements.busy);
    }

    if (body.achievements.waiting != null) {
      achievements.waiting = Number(body.achievements.waiting);
    }

    payload.achievements = achievements;
  }

  return payload;
};

router.get('/getAll', createGetAllHandler({
  model: TaskCategory,
  buildSearchParams: () => ({}),
  sort: { createdAt: -1, name: 1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: TaskCategory,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task category not found',
}));

router.post('/create', createCreateHandler({
  model: TaskCategory,
  buildPayload: (req) => buildTaskCategoryPayload(req.body),
}));

router.put('/update/:id', createUpdateHandler({
  model: TaskCategory,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildTaskCategoryPayload(req.body),
  notFoundMessage: 'Task category not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: TaskCategory,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task category not found',
  successMessage: 'Task category deleted successfully',
}));

module.exports = router;
