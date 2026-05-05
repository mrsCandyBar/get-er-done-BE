const buildTaskIdBucket = (bucket) => {
  if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) {
    return undefined;
  }

  return {
    quest: Array.isArray(bucket.quest) ? [...bucket.quest] : [],
    fun: Array.isArray(bucket.fun) ? [...bucket.fun] : [],
    new: Array.isArray(bucket.new) ? [...bucket.new] : [],
  };
};

const buildAchievementEntry = (entry = {}) => {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return undefined;
  }

  const achievement = {};
  const completed = buildTaskIdBucket(entry.completed);

  if (completed) {
    achievement.completed = completed;
  }

  if (Array.isArray(entry.recognised)) {
    achievement.recognised = entry.recognised
      .filter((item) => item != null && item !== '')
      .map((item) => String(item));
  }

  return Object.keys(achievement).length > 0 ? achievement : undefined;
};

const buildUserPayload = (body = {}) => {
  const payload = {};

  if (body.name != null || body.displayName != null || body.username != null) {
    payload.name = String(body.name ?? body.displayName ?? body.username);
  }

  if (body.email != null) {
    payload.email = String(body.email).trim().toLowerCase();
  }

  if (body.googleId != null) {
    payload.googleId = String(body.googleId).trim();
  }

  if (body.profilePicture != null || body.picture != null) {
    payload.profilePicture = String(body.profilePicture ?? body.picture);
  }

  if (body.authProvider != null) {
    payload.authProvider = String(body.authProvider);
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
    payload.progressUpdatePush = body.progressUpdatePush;
  }

  const aspirations = buildTaskIdBucket(body.aspirations);
  if (aspirations) {
    payload.aspirations = aspirations;
  }

  const achievementEntries = Array.isArray(body.achievements)
    ? body.achievements.map((entry) => buildAchievementEntry(entry)).filter(Boolean)
    : (() => {
      const singleEntry = buildAchievementEntry(body.achievements);
      return singleEntry ? [singleEntry] : [];
    })();

  if (achievementEntries.length > 0) {
    payload.achievements = achievementEntries;
  }

  if (body.startedDate != null) {
    payload.startedDate = new Date(body.startedDate);
  }

  if (body.updatedDate != null) {
    payload.updatedDate = new Date(body.updatedDate);
  }

  if (body.lastLoginDate != null) {
    payload.lastLoginDate = new Date(body.lastLoginDate);
  }

  if (body.status != null) {
    payload.status = String(body.status);
  }

  return payload;
};

module.exports = { buildUserPayload };
