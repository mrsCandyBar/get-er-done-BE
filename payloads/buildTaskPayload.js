const buildCompletedPayload = (completedBody) => {
  if (!completedBody || typeof completedBody !== 'object' || Array.isArray(completedBody)) {
    return undefined;
  }

  const completed = {};

  if (completedBody.completedDate != null) {
    completed.completedDate = new Date(completedBody.completedDate);
  }

  if (completedBody.finalNotes != null) {
    completed.finalNotes = String(completedBody.finalNotes);
  }

  if (completedBody.recur != null) {
    completed.recur = Boolean(completedBody.recur);
  }

  return completed;
};

const buildTaskPayload = (
  body = {},
  {
    includeCreatedDate = false,
    includeStartedDate = true,
    includeUpdatedDate = true,
  } = {}
) => {
  const payload = {};

  if (body.name != null || body.title != null) {
    payload.name = String(body.name ?? body.title);
  }

  if (body.description != null) {
    payload.description = String(body.description);
  }

  if (includeCreatedDate && body.createdDate != null) {
    payload.createdDate = new Date(body.createdDate);
  }

  if (includeStartedDate && body.startedDate != null) {
    payload.startedDate = new Date(body.startedDate);
  }

  if (includeUpdatedDate && body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  if (Array.isArray(body.recur)) {
    payload.recur = [...body.recur];
  }

  const completed = buildCompletedPayload(body.completed);
  if (completed) {
    payload.completed = completed;
  }

  const categoryId = body.category ?? body.taskCategoryId;
  if (categoryId != null && categoryId !== '') {
    payload.category = categoryId;
  }

  return payload;
};

const buildTaskStartPayload = (body = {}) => {
  const payload = {};

  if (body.startedDate != null) {
    payload.startedDate = new Date(body.startedDate);
  }

  if (body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  return payload;
};

const buildTaskCompletePayload = (body = {}) => {
  const payload = {};

  if (body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  const completed = buildCompletedPayload(body.completed);
  if (completed) {
    payload.completed = completed;
  }

  return payload;
};

module.exports = {
  buildTaskPayload,
  buildTaskStartPayload,
  buildTaskCompletePayload,
};
