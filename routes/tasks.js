const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
} = require('../utils/crudHandlers');
const {
  applyTaskCreateEffects,
  applyTaskStartEffects,
  applyTaskPauseEffects,
  applyTaskCompleteEffects,
  applyTaskDeleteEffects,
  isTaskCompleted,
} = require('../utils/taskEffects');
const {
  buildTaskPayload,
  buildTaskStartPayload,
  buildTaskPausePayload,
  buildTaskCompletePayload,
} = require('../payloads/buildTaskPayload');

router.get('/getAll', createGetAllHandler({
  model: Task,
  buildSearchParams: (req) => {
    const { name, recurId, userId } = req.query;
    const search = {};
    if (name) search.name = { $regex: name, $options: 'i' };
    if (recurId) search.recurId = recurId;
    if (userId) search.userId = userId;
    return search;
  },
  sort: { createdDate: -1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Task not found',
}));

router.post('/create', createCreateHandler({
  model: Task,
  buildPayload: (req) => buildTaskPayload(req.body, { includeCreatedDate: true }),
  afterCreate: (savedTask, req) => applyTaskCreateEffects(savedTask, req.body),
}));

router.put('/update/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildTaskPayload(req.body),
  notFoundMessage: 'Task not found',
}));

router.put('/start/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: () => buildTaskStartPayload(),
  afterUpdate: (savedTask, req) => applyTaskStartEffects(savedTask, req.body),
  notFoundMessage: 'Task not found',
}));

router.put('/pause/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: () => buildTaskPausePayload(),
  afterUpdate: (savedTask, req) => applyTaskPauseEffects(savedTask, req.body),
  notFoundMessage: 'Task not found',
}));

router.put('/complete/:id', createUpdateHandler({
  model: Task,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildTaskCompletePayload(req.body),
  afterUpdate: (savedTask, req, update) => applyTaskCompleteEffects(savedTask, req.body, update),
  notFoundMessage: 'Task not found',
}));

router.delete('/delete/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (isTaskCompleted(task)) {
      return res.status(400).json({ message: 'Completed tasks cannot be deleted' });
    }

    await applyTaskDeleteEffects(task, req.body);
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
