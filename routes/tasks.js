const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/getHandlers');

router.get('/getAll', createGetAllHandler({
  model: Task,
  buildSearchParams: () => ({}),
  sort: { createdAt: -1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task not found',
}));

router.post('/create', createCreateHandler({
  model: Task,
  buildPayload: (req) => ({
    title: String(req.body.title ?? ''),
    description: req.body.description != null ? String(req.body.description) : undefined,
    completed: req.body.completed != null ? Boolean(req.body.completed) : undefined,
  }),
}));

router.put('/update/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => {
    const update = {};
    if (req.body.title != null) update.title = String(req.body.title);
    if (req.body.description != null) update.description = String(req.body.description);
    if (req.body.completed != null) update.completed = Boolean(req.body.completed);
    return update;
  },
  notFoundMessage: 'Task not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task not found',
  successMessage: 'Task deleted successfully',
}));

module.exports = router;
