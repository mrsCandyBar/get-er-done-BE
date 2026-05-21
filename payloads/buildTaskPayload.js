const Badge = require('../models/badge.model');
const { toIsoTimestamp, nowIsoTimestamp } = require('../utils/dateTime');

const buildCompletedPayload = (completedBody) => {
  if (!completedBody || typeof completedBody !== 'object' || Array.isArray(completedBody)) {
    return undefined;
  }

  const completed = {};

  if (completedBody.completedDate != null) {
    const isoCompletedDate = toIsoTimestamp(completedBody.completedDate);
    if (isoCompletedDate) {
      completed.completedDate = isoCompletedDate;
    }
  }

  if (completedBody.finalNotes != null) {
    completed.finalNotes = String(completedBody.finalNotes);
  }

  if (completedBody.recur != null) {
    completed.recur = Boolean(completedBody.recur);
  }

  if (completedBody.mood != null) {
    completed.mood = String(completedBody.mood);
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
    payload.createdDate = nowIsoTimestamp();
  }

  if (includeStartedDate && body.startedDate != null) {
    const isoStartedDate = toIsoTimestamp(body.startedDate);
    if (isoStartedDate) {
      payload.startedDate = isoStartedDate;
    }
  }

  if (includeUpdatedDate && body.updatedDate != null) {
    const isoUpdatedDate = toIsoTimestamp(body.updatedDate);
    if (isoUpdatedDate) {
      payload.updatedDate = isoUpdatedDate;
    }
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

  if (body.recurId != null && body.recurId !== '') {
    payload.recurId = body.recurId;
  }

  const userId = body.userId ?? body.user;
  if (userId != null && userId !== '') {
    payload.userId = typeof userId === 'object' ? (userId._id ?? userId.id) : userId;
  }

  const checklist = body.checklist ?? body.user;
  if (checklist != null && checklist !== '') {
    payload.checklist = Array.isArray(checklist) ? [...checklist] : [checklist];
  }

  // Set state if provided, otherwise default to 'waiting' on create
  if (body.state) {
    payload.state = body.state;
  } else {
    payload.state = 'waiting';
  }

  return payload;
};

const pickRandom = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? null;
};

const getRandomBadgeFor = async (gainedFromValues = []) => {
  const values = Array.isArray(gainedFromValues) ? gainedFromValues.filter(Boolean) : [gainedFromValues];
  if (values.length === 0) {
    return null;
  }

  const badges = await Badge.find({ gainedFrom: { $in: values } }).select('_id types').lean();
  const badge = pickRandom(badges);

  if (!badge || !badge._id) {
    return null;
  }

  return {
    badgeId: String(badge._id),
    type: pickRandom(badge.types) ?? null,
  };
};

const buildTaskStartPayload = async () => {
  const nowIso = nowIsoTimestamp();
  const selectedBadge = await getRandomBadgeFor('start');

  const payload = {
    $set: {
      startedDate: nowIso,
      updatedDate: nowIso,
      state: 'busy',
    },
    $push: {
      'badges.started.date': nowIso,
    },
  };

  if (selectedBadge) {
    payload.$set['badges.started.badgeId'] = selectedBadge.badgeId;
    payload.$set['badges.started.type'] = selectedBadge.type;
  }

  return payload;
};

const buildTaskPausePayload = async () => {
  const nowIso = nowIsoTimestamp();
  const selectedBadge = await getRandomBadgeFor(['pause', 'paused']);

  const payload = {
    $set: {
      updatedDate: nowIso,
    },
    $push: {
      'badges.paused.date': nowIso,
    },
  };

  if (selectedBadge) {
    payload.$set['badges.paused.badgeId'] = selectedBadge.badgeId;
    payload.$set['badges.paused.type'] = selectedBadge.type;
  }

  return payload;
};

const buildTaskCompletePayload = async (body = {}) => {
  const nowIso = nowIsoTimestamp();
  const finalNotes = body.finalNotes ?? body.completed?.finalNotes;
  const recur = body.recur ?? body.completed?.recur;
  const completeBadge = await getRandomBadgeFor('complete');
  const recurBadge = Boolean(recur) ? await getRandomBadgeFor('recur') : null;

  const completed = {
      completedDate: nowIso,
      mood: body.mood ?? body.completed?.mood,
  };

  if (finalNotes != null) {
    completed.finalNotes = String(finalNotes);
  }

  if (recur != null) {
    completed.recur = Boolean(recur);
  }

  const payload = {
    $set: {
      updatedDate: nowIso,
      completed,
      state: 'complete',
    },
  };

  if (completeBadge) {
    payload.$set['badges.completed'] = {
      date: nowIso,
      badgeId: completeBadge.badgeId,
      type: completeBadge.type,
    };
  }

  if (recurBadge) {
    payload.$set['badges.recur'] = {
      date: nowIso,
      badgeId: recurBadge.badgeId,
      type: recurBadge.type,
    };
  }

  return payload;
};

module.exports = {
  buildTaskPayload,
  buildTaskStartPayload,
  buildTaskPausePayload,
  buildTaskCompletePayload,
};
