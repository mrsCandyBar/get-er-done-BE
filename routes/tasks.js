const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

const buildTaskPayload = (body = {}) => {
  const payload = {};

  if (body.name != null || body.title != null) {
    payload.name = String(body.name ?? body.title);
  }

  if (body.description != null) {
    payload.description = String(body.description);
  }

  if (body.createdDate != null) {
    payload.createdDate = new Date(body.createdDate);
  }

  if (Array.isArray(body.recur)) {
    payload.recur = [...body.recur];
  }

  if (body.completed && typeof body.completed === 'object' && !Array.isArray(body.completed)) {
    const completed = {};

    if (body.completed.completedDate != null) {
      completed.completedDate = new Date(body.completed.completedDate);
    }

    if (body.completed.finalNotes != null) {
      completed.finalNotes = String(body.completed.finalNotes);
    }

    if (body.completed.recur != null) {
      completed.recur = Boolean(body.completed.recur);
    }

    payload.completed = completed;
  }

  const categoryId = body.category ?? body.taskCategoryId;
  if (categoryId != null && categoryId !== '') {
    payload.category = categoryId;
  }

  return payload;
};

router.get('/getAll', createGetAllHandler({
  model: Task,
  buildSearchParams: () => ({}),
  sort: { createdDate: -1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task not found',
}));

router.post('/create', createCreateHandler({
  model: Task,
  buildPayload: (req) => buildTaskPayload(req.body),
}));

router.put('/update/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildTaskPayload(req.body),
  notFoundMessage: 'Task not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task not found',
  successMessage: 'Task deleted successfully',
}));

module.exports = router;
