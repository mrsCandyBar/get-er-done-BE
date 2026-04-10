const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new Task({
      title: String(req.body.title ?? ''),
      description: req.body.description != null ? String(req.body.description) : undefined,
      completed: req.body.completed != null ? Boolean(req.body.completed) : undefined,
    });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const update = {};
    if (req.body.title != null) update.title = String(req.body.title);
    if (req.body.description != null) update.description = String(req.body.description);
    if (req.body.completed != null) update.completed = Boolean(req.body.completed);

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
