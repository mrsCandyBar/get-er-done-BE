const express = require('express');
const router = express.Router();
const RecurringTask = require('../models/recurringTask.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

router.get('/getAll', createGetAllHandler({
  model: RecurringTask,
  buildSearchParams: (req) => {
    const { name, userId } = req.query;
    const search = {};
    if (name) search.name = { $regex: name, $options: 'i' };
    if (userId) search.userId = userId;
    return search;
  },
  sort: { createdDate: -1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: RecurringTask,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Recurring task not found',
}));

router.post('/create', createCreateHandler({
  model: RecurringTask,
  buildPayload: (req) => req.body,
}));

router.put('/update/:id', createUpdateHandler({
  model: RecurringTask,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => req.body,
  notFoundMessage: 'Recurring task not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: RecurringTask,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Recurring task not found',
}));

module.exports = router;
