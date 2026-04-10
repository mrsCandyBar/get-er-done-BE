const buildTaskPayload = (body = {}) => {
  const payload = {};

  if (body.name != null || body.title != null) {
    payload.name = String(body.name ?? body.title);
  }

  if (body.description != null) {
    payload.description = String(body.description);
  }

  if (body.createdDate != null) {
    payload.createdDate = new Date(body.createdDate);
  }

  if (Array.isArray(body.recur)) {
    payload.recur = [...body.recur];
  }

  if (body.completed && typeof body.completed === 'object' && !Array.isArray(body.completed)) {
    const completed = {};

    if (body.completed.completedDate != null) {
      completed.completedDate = new Date(body.completed.completedDate);
    }

    if (body.completed.finalNotes != null) {
      completed.finalNotes = String(body.completed.finalNotes);
    }

    if (body.completed.recur != null) {
      completed.recur = Boolean(body.completed.recur);
    }

    payload.completed = completed;
  }

  const categoryId = body.category ?? body.taskCategoryId;
  if (categoryId != null && categoryId !== '') {
    payload.category = categoryId;
  }

  return payload;
};

module.exports = { buildTaskPayload };
