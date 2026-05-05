const createGetAllHandler = ({
  model,
  buildSearchParams = () => ({}),
  sort = { createdAt: -1 },
}) => async (req, res) => {
  try {
    const searchParams = buildSearchParams(req);
    const records = await model.find(searchParams).sort(sort);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGetOneHandler = ({
  model,
  buildSearchParams,
  notFoundMessage = 'Resource not found',
  findRecord = (currentModel, searchParams, req, res) => {
    if (
      searchParams &&
      typeof searchParams === 'object' &&
      Object.keys(searchParams).length === 1 &&
      Object.prototype.hasOwnProperty.call(searchParams, '_id') &&
      typeof currentModel.findById === 'function'
    ) {
      return currentModel.findById(searchParams._id);
    }

    return currentModel.findOne(searchParams);
  },
}) => async (req, res) => {
  try {
    const searchParams = buildSearchParams(req);
    const record = await findRecord(model, searchParams, req, res);

    // If findRecord handled the response (e.g., 401), stop here
    if (record === null && req && req._authError) return;

    if (!record) {
      return res.status(404).json({ message: notFoundMessage });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCreateHandler = ({
  model,
  buildPayload = (req) => req.body,
  validationErrorStatus = 400,
  afterCreate = async () => {},
}) => async (req, res) => {
  try {
    const payload = buildPayload(req);
    const record = new model(payload);
    const saved = await record.save();
    await afterCreate(saved, req, payload);
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(validationErrorStatus).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

const createUpdateHandler = ({
  model,
  buildSearchParams,
  buildUpdate = (req) => req.body,
  notFoundMessage = 'Resource not found',
  validationErrorStatus = 400,
  updateOptions = { new: true, runValidators: true },
  afterUpdate = async () => {},
  updateRecord = (currentModel, searchParams, update, options) => {
    if (
      searchParams &&
      typeof searchParams === 'object' &&
      Object.keys(searchParams).length === 1 &&
      Object.prototype.hasOwnProperty.call(searchParams, '_id') &&
      typeof currentModel.findByIdAndUpdate === 'function'
    ) {
      return currentModel.findByIdAndUpdate(searchParams._id, update, options);
    }

    return currentModel.findOneAndUpdate(searchParams, update, options);
  },
}) => async (req, res) => {
  try {
    const searchParams = buildSearchParams(req);
    const update = buildUpdate(req);
    const record = await updateRecord(model, searchParams, update, updateOptions);

    if (!record) {
      return res.status(404).json({ message: notFoundMessage });
    }

    await afterUpdate(record, req, update);
    res.json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(validationErrorStatus).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

const createDeleteHandler = ({
  model,
  buildSearchParams,
  notFoundMessage = 'Resource not found',
  successMessage = 'Resource deleted successfully',
  deleteRecord = (currentModel, searchParams) => {
    if (
      searchParams &&
      typeof searchParams === 'object' &&
      Object.keys(searchParams).length === 1 &&
      Object.prototype.hasOwnProperty.call(searchParams, '_id') &&
      typeof currentModel.findByIdAndDelete === 'function'
    ) {
      return currentModel.findByIdAndDelete(searchParams._id);
    }

    return currentModel.findOneAndDelete(searchParams);
  },
}) => async (req, res) => {
  try {
    const searchParams = buildSearchParams(req);
    const record = await deleteRecord(model, searchParams);

    if (!record) {
      return res.status(404).json({ message: notFoundMessage });
    }

    res.json({ message: successMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createGetAllHandler,
  createGetOneHandler,
  createCreateHandler,
  createUpdateHandler,
  createDeleteHandler,
};
