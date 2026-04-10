const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
} = require('../utils/crudHandlers');
const { buildUserPayload } = require('../payloads/buildUserPayload');

router.get('/getAll', createGetAllHandler({
  model: User,
  buildSearchParams: () => ({}),
  sort: { updatedDate: -1, name: 1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
}));

router.post('/create', createCreateHandler({
  model: User,
  buildPayload: (req) => buildUserPayload(req.body),
}));

router.put('/update/:id', createUpdateHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => buildUserPayload(req.body),
  notFoundMessage: 'User not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
  successMessage: 'User deleted successfully',
}));

module.exports = router;
