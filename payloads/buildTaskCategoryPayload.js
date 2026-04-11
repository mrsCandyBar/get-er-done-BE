const buildTaskCategoryPayload = (body = {}) => {
  const payload = {};

  if (body.name != null) payload.name = String(body.name);
  if (body.count != null) payload.count = Number(body.count);
  if (body.description != null) payload.description = String(body.description);

  if (body.achievements && typeof body.achievements === 'object') {
    const achievements = {};

    if (body.achievements.completed != null) {
      achievements.completed = Number(body.achievements.completed);
    }

    if (body.achievements.busy != null) {
      achievements.busy = Number(body.achievements.busy);
    }

    if (body.achievements.waiting != null) {
      achievements.waiting = Number(body.achievements.waiting);
    }

    payload.achievements = achievements;
  }

  return payload;
};

module.exports = { buildTaskCategoryPayload };
