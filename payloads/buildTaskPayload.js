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

  if (includeCreatedDate) {
    payload.createdDate = new Date();
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

  const userId = body.userId ?? body.user;
  if (userId != null && userId !== '') {
    payload.userId = typeof userId === 'object' ? (userId._id ?? userId.id) : userId;
  }

  return payload;
};

const buildTaskStartPayload = () => {
  const now = new Date();

  return {
    startedDate: now,
    updatedDate: now,
  };
};

const buildTaskPausePayload = () => ({
  updatedDate: new Date(),
});

const buildTaskCompletePayload = (body = {}) => {
  const now = new Date();
  const finalNotes = body.finalNotes ?? body.completed?.finalNotes;
  const recur = body.recur ?? body.completed?.recur;

  const completed = {
    completedDate: now,
  };

  if (finalNotes != null) {
    completed.finalNotes = String(finalNotes);
  }

  if (recur != null) {
    completed.recur = Boolean(recur);
  }

  return {
    updatedDate: now,
    completed,
  };
};

module.exports = {
  buildTaskPayload,
  buildTaskStartPayload,
  buildTaskPausePayload,
  buildTaskCompletePayload,
};
