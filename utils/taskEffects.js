const Task = require('../models/task.model');
const User = require('../models/user.model');
const TaskCategory = require('../models/taskCategory.model');
const { buildTaskPayload } = require('../payloads/buildTaskPayload');

const ASPIRATION_KEYS = new Set(['task', 'fun', 'new']);
const ACHIEVEMENT_PROGRESS_KEYS = new Set(['busy', 'waiting']);

const resolveUserId = (...sources) => {
  for (const source of sources) {
    if (!source || typeof source !== 'object') {
      continue;
    }

    if (source.userId != null) {
      return source.userId;
    }

    if (typeof source.user === 'string') {
      return source.user;
    }

    if (source.user && typeof source.user === 'object') {
      return source.user._id ?? source.user.id;
    }
  }

  return undefined;
};

const normaliseAspirationKey = (value) => {
  if (value == null) {
    return undefined;
  }

  const key = String(value).trim().toLowerCase();
  return ASPIRATION_KEYS.has(key) ? key : undefined;
};

const normaliseAchievementProgressKey = (value) => {
  if (value == null) {
    return undefined;
  }

  const key = String(value).trim().toLowerCase();
  return ACHIEVEMENT_PROGRESS_KEYS.has(key) ? key : undefined;
};

const sameId = (left, right) => String(left) === String(right);

const removeTaskId = (items = [], taskId) => (Array.isArray(items)
  ? items.filter((item) => !sameId(item, taskId))
  : []);

const addTaskId = (items = [], taskId) => {
  const nextItems = Array.isArray(items) ? [...items] : [];

  if (!nextItems.some((item) => sameId(item, taskId))) {
    nextItems.push(taskId);
  }

  return nextItems;
};

const createAchievementBucket = (bucket = {}) => ({
  task: Array.isArray(bucket.task) ? [...bucket.task] : [],
  fun: Array.isArray(bucket.fun) ? [...bucket.fun] : [],
  new: Array.isArray(bucket.new) ? [...bucket.new] : [],
});

const resolveCategoryDetails = async (savedTask, body = {}) => {
  const directKey = normaliseAspirationKey(body.categoryName ?? body.categoryKey);
  const categorySource = savedTask?.category ?? body.category ?? body.taskCategoryId;

  if (!categorySource && !directKey) {
    return {};
  }

  if (typeof categorySource === 'object' && categorySource !== null) {
    const categoryId = categorySource._id ?? categorySource.id;
    const categoryKeyFromObject = directKey
      ?? normaliseAspirationKey(categorySource.name ?? categorySource.label ?? categorySource.value);

    if (categoryKeyFromObject || !categoryId) {
      return {
        categoryId,
        categoryKey: categoryKeyFromObject,
      };
    }

    const category = await TaskCategory.findById(categoryId);

    return {
      categoryId: category?._id ?? categoryId,
      categoryKey: normaliseAspirationKey(category?.name),
    };
  }

  if (typeof categorySource === 'string') {
    const category = await TaskCategory.findById(categorySource);

    if (category) {
      return {
        categoryId: category._id ?? categorySource,
        categoryKey: directKey ?? normaliseAspirationKey(category?.name),
      };
    }

    return {
      categoryId: undefined,
      categoryKey: directKey ?? normaliseAspirationKey(categorySource),
    };
  }

  return { categoryId: undefined, categoryKey: directKey };
};

const findAssociatedUser = async (savedTask, body = {}, categoryKey) => {
  const userId = resolveUserId(body, savedTask);

  if (userId) {
    const user = await User.findById(userId);
    return { userId, user };
  }

  if (categoryKey) {
    const user = await User.findOne({ [`aspirations.${categoryKey}`]: savedTask._id });

    if (user) {
      return { userId: user._id, user };
    }
  }

  const fallbackUser = await User.findOne({
    $or: [...ASPIRATION_KEYS].map((key) => ({ [`aspirations.${key}`]: savedTask._id })),
  });

  return {
    userId: fallbackUser?._id,
    user: fallbackUser ?? null,
  };
};

const updateTaskCategoryProgress = async (categoryId, increments, updatedAt = new Date()) => {
  if (!categoryId) {
    return;
  }

  await TaskCategory.findByIdAndUpdate(
    categoryId,
    {
      $inc: increments,
      $set: {
        updatedAt,
      },
    },
    { new: true, runValidators: true }
  );
};

const isTaskCompleted = (task) => {
  if (!task?.completed || typeof task.completed !== 'object') {
    return false;
  }

  const { completedDate, finalNotes, recur } = task.completed;
  return completedDate != null || Boolean(String(finalNotes ?? '').trim()) || recur === true;
};

const applyTaskCreateEffects = async (savedTask, body = {}) => {
  if (!savedTask?._id) {
    return;
  }

  const { categoryId, categoryKey } = await resolveCategoryDetails(savedTask, body);
  const userId = resolveUserId(body, savedTask);

  if (userId && categoryKey) {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { [`aspirations.${categoryKey}`]: savedTask._id } },
      { new: true, runValidators: true }
    );
  }

  await updateTaskCategoryProgress(categoryId, {
    count: 1,
    'achievements.waiting': 1,
  });
};

const applyTaskStartEffects = async (savedTask, body = {}) => {
  if (!savedTask?._id) {
    return;
  }

  const { categoryId, categoryKey } = await resolveCategoryDetails(savedTask, body);
  const { userId } = await findAssociatedUser(savedTask, body, categoryKey);
  const now = new Date();

  await updateTaskCategoryProgress(categoryId, {
    'achievements.busy': 1,
    'achievements.waiting': -1,
  });

  if (userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          updatedDate: now,
        },
      },
      { new: true, runValidators: true }
    );
  }
};

const applyTaskPauseEffects = async (savedTask, body = {}) => {
  if (!savedTask?._id) {
    return;
  }

  const { categoryId } = await resolveCategoryDetails(savedTask, body);

  await updateTaskCategoryProgress(categoryId, {
    'achievements.busy': -1,
    'achievements.waiting': 1,
  });
};

const applyTaskCompleteEffects = async (savedTask, body = {}, update = {}) => {
  if (!savedTask?._id) {
    return;
  }

  const { categoryId, categoryKey } = await resolveCategoryDetails(savedTask, body);
  const { userId, user } = await findAssociatedUser(savedTask, body, categoryKey);
  const now = new Date();

  // Update completedAt for the previous achievement and set createdAt for the new one
  if (userId && user && Array.isArray(user.achievements)) {
    const achievements = user.achievements;
    const prevIndex = achievements.length - 1;
    if (prevIndex >= 0) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`achievements.${prevIndex}.completedAt`]: now,
          },
        },
        { new: true, runValidators: true }
      );
    }
    // When a new achievement is added, set createdAt
    const newIndex = achievements.length;
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          [`achievements.${newIndex}.createdAt`]: now,
        },
      },
      { new: true, runValidators: true }
    );
  }

  await updateTaskCategoryProgress(
    categoryId,
    {
      'achievements.busy': -1,
      'achievements.completed': 1,
    },
    now
  );

  if (userId && user && categoryKey) {
    const achievements = Array.isArray(user.achievements) ? user.achievements : [];
    const latestIndex = achievements.length > 0 ? achievements.length - 1 : 0;

    if (achievements.length === 0) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`achievements.${latestIndex}`]: {
              completed: createAchievementBucket(),
              recognised: [],
            },
          },
        },
        { new: true, runValidators: true }
      );
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          [`aspirations.${categoryKey}`]: savedTask._id,
        },
        $addToSet: {
          [`achievements.${latestIndex}.completed.${categoryKey}`]: savedTask._id,
        },
        $set: {
          updatedDate: now,
        },
      },
      { new: true, runValidators: true }
    );
  }

  const shouldRecur = Boolean(update?.completed?.recur ?? body.recur ?? body.completed?.recur);

  if (shouldRecur) {
    const sourceTask = savedTask?.toObject ? savedTask.toObject() : { ...savedTask };
    const recurringPayload = buildTaskPayload(
      {
        ...sourceTask,
        recur: addTaskId(sourceTask.recur, savedTask._id),
        completed: undefined,
      },
      {
        includeCreatedDate: true,
        includeStartedDate: false,
        includeUpdatedDate: false,
      }
    );

    delete recurringPayload.completed;
    delete recurringPayload.startedDate;
    delete recurringPayload.updatedDate;

    const recurringTask = new Task(recurringPayload);
    const savedRecurringTask = await recurringTask.save();
    await applyTaskCreateEffects(savedRecurringTask, recurringPayload);
  }
};

const applyTaskDeleteEffects = async (savedTask, body = {}) => {
  if (!savedTask?._id) {
    return;
  }

  const { categoryId, categoryKey } = await resolveCategoryDetails(savedTask, body);
  const { userId } = await findAssociatedUser(savedTask, body, categoryKey);
  const now = new Date();

  if (userId) {
    const userUpdate = {
      $set: {
        updatedDate: now,
      },
    };

    if (categoryKey) {
      userUpdate.$pull = {
        [`aspirations.${categoryKey}`]: savedTask._id,
      };
    }

    await User.findByIdAndUpdate(userId, userUpdate, { new: true, runValidators: true });
  }

  const categoryUpdates = {
    count: -1,
  };

  const explicitAchievementProperty = normaliseAchievementProgressKey(
    body.achievementProperty ?? body.achievementKey ?? body.progressKey
  );
  const achievementPropertyToDecrement = explicitAchievementProperty ?? (savedTask.startedDate ? 'busy' : 'waiting');

  categoryUpdates[`achievements.${achievementPropertyToDecrement}`] = -1;

  await updateTaskCategoryProgress(categoryId, categoryUpdates, now);
};

module.exports = {
  applyTaskCreateEffects,
  applyTaskStartEffects,
  applyTaskPauseEffects,
  applyTaskCompleteEffects,
  applyTaskDeleteEffects,
  isTaskCompleted,
};
