const express = require('express');
const router = express.Router();
const Badge = require('../models/badge.model');

// Create Badge
router.post('/create', async (req, res) => {
  try {
    const badge = new Badge(req.body);
    const saved = await badge.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Badges
router.get('/getAll', async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Badge by ID
router.get('/get/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    res.json(badge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Badge
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Badge not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Badge
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Badge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Badge not found' });
    res.json({ message: 'Badge deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
