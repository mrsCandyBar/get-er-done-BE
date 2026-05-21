const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

router.post('/create', createCreateHandler({
  model: Achievement,
}));

router.get('/getAll', createGetAllHandler({
  model: Achievement,
  buildSearchParams: () => ({}),
}));

router.get('/get/:id', createGetOneHandler({
  model: Achievement,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Achievement not found',
}));

router.put('/update/:id', createUpdateHandler({
  model: Achievement,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Achievement not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: Achievement,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Achievement not found',
  successMessage: 'Achievement deleted',
}));

module.exports = router;
