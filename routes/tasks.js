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
const { buildTaskPayload } = require('../payloads/buildTaskPayload');

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
