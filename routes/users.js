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

router.get('/getAll', createGetAllHandler({
  model: User,
  buildSearchParams: () => ({}),
  sort: { createdAt: -1, username: 1 },
}));

router.get('/get/:id', createGetOneHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
}));

router.post('/create', createCreateHandler({
  model: User,
  buildPayload: (req) => ({
    username: req.body.username != null ? String(req.body.username) : undefined,
    email: req.body.email != null ? String(req.body.email).toLowerCase() : undefined,
    displayName: req.body.displayName != null ? String(req.body.displayName) : undefined,
    active: req.body.active != null ? Boolean(req.body.active) : undefined,
  }),
}));

router.put('/update/:id', createUpdateHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  buildUpdate: (req) => {
    const update = {};
    if (req.body.username != null) update.username = String(req.body.username);
    if (req.body.email != null) update.email = String(req.body.email).toLowerCase();
    if (req.body.displayName != null) update.displayName = String(req.body.displayName);
    if (req.body.active != null) update.active = Boolean(req.body.active);
    return update;
  },
  notFoundMessage: 'User not found',
}));

router.delete('/delete/:id', createDeleteHandler({
  model: User,
  buildSearchParams: (req) => ({ _id: req.params.id }),
  notFoundMessage: 'User not found',
  successMessage: 'User deleted successfully',
}));

module.exports = router;
