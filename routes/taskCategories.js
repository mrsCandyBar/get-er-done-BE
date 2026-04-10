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
  buildPayload: (req) => ({
    name: req.body.name != null ? String(req.body.name) : undefined,
    description: req.body.description != null ? String(req.body.description) : undefined,
    color: req.body.color != null ? String(req.body.color) : undefined,
  }),
}));

router.put('/update/:id', createUpdateHandler({
  model: TaskCategory,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => {
    const update = {};
    if (req.body.name != null) update.name = String(req.body.name);
    if (req.body.description != null) update.description = String(req.body.description);
    if (req.body.color != null) update.color = String(req.body.color);
    return update;
  },
  notFoundMessage: 'Task category not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: TaskCategory,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task category not found',
  successMessage: 'Task category deleted successfully',
}));

module.exports = router;
