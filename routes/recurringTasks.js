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
const { nowIsoTimestamp, toIsoTimestamp } = require('../utils/dateTime');

const authMiddleware = require('../utils/authMiddleware');

// Protect all routes below
router.use(authMiddleware);

router.get('/getAll', createGetAllHandler({
  model: RecurringTask,
  buildSearchParams: (req) => {
    const { name } = req.query;
    const userId = req.userId;
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
  buildPayload: (req) => {
    const payload = { ...req.body };
    payload.createdDate = toIsoTimestamp(payload.createdDate) ?? nowIsoTimestamp();
    payload.updatedDate = toIsoTimestamp(payload.updatedDate) ?? nowIsoTimestamp();
    return payload;
  },
}));

router.put('/update/:id', createUpdateHandler({
  model: RecurringTask,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => {
    const payload = { ...req.body };

    if (payload.createdDate != null) {
      payload.createdDate = toIsoTimestamp(payload.createdDate);
    }

    payload.updatedDate = nowIsoTimestamp();
    return payload;
  },
  notFoundMessage: 'Recurring task not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: RecurringTask,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Recurring task not found',
}));

module.exports = router;
