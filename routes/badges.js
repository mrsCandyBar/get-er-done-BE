const express = require('express');
const router = express.Router();
const Badge = require('../models/badge.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');

router.post('/create', createCreateHandler({
  model: Badge,
}));

router.get('/getAll', createGetAllHandler({
  model: Badge,
  buildSearchParams: () => ({}),
}));

router.get('/get/:id', createGetOneHandler({
  model: Badge,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Badge not found',
}));

router.put('/update/:id', createUpdateHandler({
  model: Badge,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Badge not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: Badge,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'Badge not found',
  successMessage: 'Badge deleted',
}));

module.exports = router;
