const buildUserPayload = (body = {}) => {
  const payload = {};

  if (body.name != null || body.displayName != null || body.username != null) {
    payload.name = String(body.name ?? body.displayName ?? body.username);
  }

  if (body.dob != null) {
    payload.dob = new Date(body.dob);
  }

  if (body.about != null) {
    payload.about = String(body.about);
  }

  if (Array.isArray(body.inspirations)) {
    payload.inspirations = body.inspirations.map((item = {}) => ({
      inspirations: item.inspirations != null ? String(item.inspirations) : '',
      reason: item.reason != null ? String(item.reason) : '',
      url: item.url != null ? String(item.url) : '',
    }));
  }

  if (body.progressUpdatePush != null) {
    payload.progressUpdatePush = String(body.progressUpdatePush);
  }

  if (body.achievements && typeof body.achievements === 'object') {
    const achievements = {};

    if (body.achievements.completed && typeof body.achievements.completed === 'object') {
      achievements.completed = {
        task: Array.isArray(body.achievements.completed.task)
          ? [...body.achievements.completed.task]
          : [],
        fun: Array.isArray(body.achievements.completed.fun)
          ? [...body.achievements.completed.fun]
          : [],
        new: Array.isArray(body.achievements.completed.new)
          ? [...body.achievements.completed.new]
          : [],
      };
    }

    payload.achievements = achievements;
  }

  if (body.startedDate != null) {
    payload.startedDate = new Date(body.startedDate);
  }

  if (body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  return payload;
};

module.exports = { buildUserPayload };
