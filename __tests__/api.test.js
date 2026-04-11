/**
 * Tests for the Get-Er-Done API.
 * The mongoose model is mocked so no real MongoDB connection is needed.
 */
const request = require('supertest');

// ── Mock mongoose connect so server.js does not try to connect ────────────────
jest.mock('../db/connection', () => ({
  connect: jest.fn().mockResolvedValue(undefined),
}));

// ── Mock the Task model ───────────────────────────────────────────────────────
const mockTask = {
  _id: '69d76d7ab3f97a842c094818',
  userId: '69d7663ab3f97a842c0947fc',
  name: 'Complete Git-er-done',
  description: 'get her off the ground!',
  createdDate: new Date('2026-10-03T22:00:00.000Z').toISOString(),
  startedDate: new Date('2026-10-04T09:00:00.000Z').toISOString(),
  updatedDate: new Date('2026-10-05T12:30:00.000Z').toISOString(),
  recur: [],
  category: '69d769a5b3f97a842c094800',
};

const mockTaskCategory = {
  _id: '69d769a5b3f97a842c094800',
  name: 'fun',
  count: 0,
  description: '',
  achievements: {
    completed: 0,
    busy: 0,
    waiting: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockUser = {
  _id: '69d7663ab3f97a842c0947fc',
  name: 'Candice Bar',
  dob: new Date('1987-04-06T22:00:00.000Z').toISOString(),
  about: 'I am a developer looking to expand my ideals',
  inspirations: [
    {
      inspirations: 'Vivienne Westwood, Yoshitaka Amano, Sephiroth',
      reason: 'to be more bold!',
      url: '',
    },
  ],
  progressUpdatePush: '1 month',
  aspirations: {
    task: ['69d76d7ab3f97a842c094818'],
    fun: ['69d76d7ab3f97a842c094818', '69d76d7ab3f97a842c094819'],
    new: ['69d76d7ab3f97a842c09481a'],
  },
  achievements: [
    {
      completed: {
        task: [],
        fun: [],
        new: [],
      },
      recognised: ['consistency', 'creativity'],
    },
  ],
  startedDate: new Date('2026-10-03T22:00:00.000Z').toISOString(),
  updatedDate: new Date('2026-10-03T22:00:00.000Z').toISOString(),
};

jest.mock('../models/task.model', () => {
  const mockSave = jest.fn().mockResolvedValue(mockTask);
  const MockTask = jest.fn(function MockTask(data) {
    Object.assign(this, data);
    this.save = mockSave;
  });
  MockTask.find = jest.fn(() => ({ sort: jest.fn().mockResolvedValue([mockTask]) }));
  MockTask.findById = jest.fn().mockResolvedValue(mockTask);
  MockTask.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTask);
  MockTask.findByIdAndDelete = jest.fn().mockResolvedValue(mockTask);
  return MockTask;
});

jest.mock('../models/taskCategory.model', () => {
  const mockSave = jest.fn().mockResolvedValue(mockTaskCategory);
  function MockTaskCategory(data) {
    Object.assign(this, data);
    this.save = mockSave;
  }
  MockTaskCategory.find = jest.fn(() => ({ sort: jest.fn().mockResolvedValue([mockTaskCategory]) }));
  MockTaskCategory.findById = jest.fn().mockResolvedValue(mockTaskCategory);
  MockTaskCategory.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTaskCategory);
  MockTaskCategory.findByIdAndDelete = jest.fn().mockResolvedValue(mockTaskCategory);
  return MockTaskCategory;
});

jest.mock('../models/user.model', () => {
  const mockSave = jest.fn().mockResolvedValue(mockUser);
  const MockUser = jest.fn(function MockUser(data) {
    Object.assign(this, data);
    this.save = mockSave;
  });
  MockUser.find = jest.fn(() => ({ sort: jest.fn().mockResolvedValue([mockUser]) }));
  MockUser.findOne = jest.fn().mockResolvedValue(mockUser);
  MockUser.findById = jest.fn().mockResolvedValue(mockUser);
  MockUser.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);
  MockUser.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);
  return MockUser;
});

const app = require('../server');
const Task = require('../models/task.model');
const TaskCategory = require('../models/taskCategory.model');
const User = require('../models/user.model');

// ── Info / Home page ──────────────────────────────────────────────────────────
describe('GET /', () => {
  it('returns 200 and the info HTML page', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Get-Er-Done API');
    expect(res.text).toContain('/api-docs');
  });
});

// ── Swagger ───────────────────────────────────────────────────────────────────
describe('GET /api-docs.json', () => {
  it('returns valid OpenAPI JSON', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.0');
    expect(res.body.info.title).toBe('Get-Er-Done API');
  });
});

describe('GET /api-docs', () => {
  it('returns 200 and serves Swagger UI', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger');
  });
});

// ── Tasks CRUD ────────────────────────────────────────────────────────────────
describe('GET /api/tasks/getAll', () => {
  it('returns 200 and an array of tasks', async () => {
    const res = await request(app).get('/api/tasks/getAll');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/tasks/get/:id', () => {
  it('returns 200 and the task', async () => {
    const res = await request(app).get(`/api/tasks/get/${mockTask._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(mockTask.name);
  });

  it('returns 404 when task is not found', async () => {
    Task.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/tasks/get/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/tasks/create', () => {
  it('returns 201, creates the task, and updates the user aspiration bucket for the task category', async () => {
    const requestedCreatedDate = '2026-10-03T22:00:00.000Z';

    const res = await request(app)
      .post('/api/tasks/create')
      .send({
        userId: mockUser._id,
        name: 'Complete Git-er-done',
        description: 'get her off the ground!',
        createdDate: requestedCreatedDate,
        startedDate: '2026-10-04T09:00:00.000Z',
        updatedDate: '2026-10-05T12:30:00.000Z',
        recur: [],
        completed: {
          completedDate: '2026-10-03T22:00:00.000Z',
          finalNotes: 'will do this again!',
          recur: true,
        },
        category: '69d769a5b3f97a842c094800',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockTask.name);

    const createdTaskPayload = Task.mock.calls.at(-1)[0];
    expect(createdTaskPayload.createdDate).toEqual(expect.any(Date));
    expect(createdTaskPayload.createdDate.toISOString()).not.toBe(requestedCreatedDate);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      { $addToSet: { 'aspirations.fun': mockTask._id } },
      { new: true, runValidators: true }
    );
    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      '69d769a5b3f97a842c094800',
      {
        $inc: {
          count: 1,
          'achievements.waiting': 1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });

  it('still updates the user aspiration bucket when the saved task category comes back as an ObjectId-like object', async () => {
    const originalCategory = mockTask.category;
    mockTask.category = { id: '69d769a5b3f97a842c094800' };

    User.findByIdAndUpdate.mockClear();
    TaskCategory.findById.mockClear();

    try {
      const res = await request(app)
        .post('/api/tasks/create')
        .send({
          userId: mockUser._id,
          name: 'ObjectId category task',
          category: '69d769a5b3f97a842c094800',
        });

      expect(res.status).toBe(201);
      expect(TaskCategory.findById).toHaveBeenCalledWith('69d769a5b3f97a842c094800');
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $addToSet: { 'aspirations.fun': mockTask._id } },
        { new: true, runValidators: true }
      );
    } finally {
      mockTask.category = originalCategory;
    }
  });
});

describe('PUT /api/tasks/update/:id', () => {
  it('returns 200 and the updated task', async () => {
    const res = await request(app)
      .put(`/api/tasks/update/${mockTask._id}`)
      .send({
        name: 'Complete Git-er-done',
        startedDate: '2026-10-04T09:00:00.000Z',
        updatedDate: '2026-10-05T12:30:00.000Z',
        completed: {
          completedDate: '2026-10-03T22:00:00.000Z',
          finalNotes: 'updated note',
          recur: false,
        },
      });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);
  });

  it('returns 404 when task is not found', async () => {
    Task.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/tasks/update/000000000000000000000000')
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/tasks/startTask/:id', () => {
  it('returns 200, updates the task dates, updates the task category, and refreshes the user updatedDate', async () => {
    User.findByIdAndUpdate.mockClear();
    TaskCategory.findByIdAndUpdate.mockClear();

    const requestedStartedDate = '2026-10-06T08:00:00.000Z';
    const requestedUpdatedDate = '2026-10-06T08:05:00.000Z';

    const res = await request(app)
      .put(`/api/tasks/startTask/${mockTask._id}`)
      .send({
        userId: mockUser._id,
        name: 'Should be ignored',
        startedDate: requestedStartedDate,
        updatedDate: requestedUpdatedDate,
      });

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);

    const [, updatePayload] = Task.findByIdAndUpdate.mock.calls.at(-1);
    expect(updatePayload).toEqual(expect.objectContaining({
      startedDate: expect.any(Date),
      updatedDate: expect.any(Date),
    }));
    expect(updatePayload.startedDate.toISOString()).not.toBe(requestedStartedDate);
    expect(updatePayload.updatedDate.toISOString()).not.toBe(requestedUpdatedDate);
    expect(updatePayload.name).toBeUndefined();
    expect(updatePayload.completed).toBeUndefined();

    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      '69d769a5b3f97a842c094800',
      {
        $inc: {
          'achievements.busy': 1,
          'achievements.waiting': -1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      {
        $set: {
          updatedDate: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });
});

describe('PUT /api/tasks/pauseTask/:id', () => {
  it('returns 200, updates the task updatedDate, and moves the category from busy back to waiting', async () => {
    TaskCategory.findByIdAndUpdate.mockClear();

    const res = await request(app)
      .put(`/api/tasks/pauseTask/${mockTask._id}`)
      .send({
        userId: mockUser._id,
      });

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);

    const [, updatePayload] = Task.findByIdAndUpdate.mock.calls.at(-1);
    expect(updatePayload).toEqual({
      updatedDate: expect.any(Date),
    });

    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      '69d769a5b3f97a842c094800',
      {
        $inc: {
          'achievements.busy': -1,
          'achievements.waiting': 1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });
});

describe('PUT /api/tasks/completeTask/:id', () => {
  it('returns 200, completes the task, updates related records, and creates a new recurring task when requested', async () => {
    Task.mockClear();
    Task.findByIdAndUpdate.mockClear();
    TaskCategory.findByIdAndUpdate.mockClear();
    User.findByIdAndUpdate.mockClear();

    const res = await request(app)
      .put(`/api/tasks/completeTask/${mockTask._id}`)
      .send({
        finalNotes: 'finished strong',
        recur: true,
      });

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);

    const [, updatePayload] = Task.findByIdAndUpdate.mock.calls.at(-1);
    expect(updatePayload).toEqual(expect.objectContaining({
      updatedDate: expect.any(Date),
      completed: expect.objectContaining({
        completedDate: expect.any(Date),
        finalNotes: 'finished strong',
        recur: true,
      }),
    }));
    expect(updatePayload.name).toBeUndefined();
    expect(updatePayload.startedDate).toBeUndefined();

    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      mockTask.category,
      {
        $inc: {
          'achievements.busy': -1,
          'achievements.completed': 1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockTask.userId,
      {
        $pull: {
          'aspirations.fun': mockTask._id,
        },
        $addToSet: {
          'achievements.0.completed.fun': mockTask._id,
        },
        $set: {
          updatedDate: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );

    expect(Task).toHaveBeenCalledTimes(1);
    const [recurringTaskPayload] = Task.mock.calls.at(-1);
    expect(recurringTaskPayload).toEqual(expect.objectContaining({
      name: mockTask.name,
      description: mockTask.description,
      category: mockTask.category,
      userId: mockTask.userId,
      createdDate: expect.any(Date),
      recur: [mockTask._id],
    }));
    expect(recurringTaskPayload.completed).toBeUndefined();
    expect(recurringTaskPayload.startedDate).toBeUndefined();
    expect(recurringTaskPayload.updatedDate).toBeUndefined();
  });

  it('still adds the completed task to the latest user achievement entry when the task has no stored userId', async () => {
    const taskWithoutUserId = {
      ...mockTask,
      userId: undefined,
    };

    Task.findByIdAndUpdate.mockResolvedValueOnce(taskWithoutUserId);
    User.findOne.mockClear();
    User.findByIdAndUpdate.mockClear();

    const res = await request(app)
      .put(`/api/tasks/completeTask/${mockTask._id}`)
      .send({
        finalNotes: 'fallback user lookup',
        recur: false,
      });

    expect(res.status).toBe(200);
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      {
        $pull: {
          'aspirations.fun': mockTask._id,
        },
        $addToSet: {
          'achievements.0.completed.fun': mockTask._id,
        },
        $set: {
          updatedDate: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });
});

describe('DELETE /api/tasks/delete/:id', () => {
  it('returns 200, removes the task from the user aspiration list, updates the user, and decrements the started task category counters', async () => {
    User.findByIdAndUpdate.mockClear();
    TaskCategory.findByIdAndUpdate.mockClear();

    const res = await request(app)
      .delete(`/api/tasks/delete/${mockTask._id}`)
      .send({ achievementProperty: 'busy' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockTask.userId,
      {
        $pull: { 'aspirations.fun': mockTask._id },
        $set: { updatedDate: expect.any(Date) },
      },
      { new: true, runValidators: true }
    );
    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      mockTask.category,
      {
        $inc: {
          count: -1,
          'achievements.busy': -1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
    expect(Task.findByIdAndDelete).toHaveBeenCalledWith(mockTask._id);
  });

  it('decrements waiting when the caller explicitly says the task is currently waiting', async () => {
    const waitingTask = {
      ...mockTask,
      _id: '69d76d7ab3f97a842c09481b',
      startedDate: new Date('2026-10-04T09:00:00.000Z').toISOString(),
    };

    Task.findById.mockResolvedValueOnce(waitingTask);
    Task.findByIdAndDelete.mockResolvedValueOnce(waitingTask);
    TaskCategory.findByIdAndUpdate.mockClear();

    const res = await request(app)
      .delete(`/api/tasks/delete/${waitingTask._id}`)
      .send({ achievementProperty: 'waiting' });

    expect(res.status).toBe(200);
    expect(TaskCategory.findByIdAndUpdate).toHaveBeenCalledWith(
      waitingTask.category,
      {
        $inc: {
          count: -1,
          'achievements.waiting': -1,
        },
        $set: {
          updatedAt: expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });

  it('returns 400 when the task has already been completed', async () => {
    const completedTask = {
      ...mockTask,
      completed: {
        completedDate: new Date('2026-10-06T08:00:00.000Z').toISOString(),
        finalNotes: 'all done',
        recur: false,
      },
    };

    Task.findById.mockResolvedValueOnce(completedTask);
    Task.findByIdAndDelete.mockClear();

    const res = await request(app).delete(`/api/tasks/delete/${mockTask._id}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Completed tasks cannot be deleted');
    expect(Task.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('returns 404 when task is not found', async () => {
    Task.findById.mockResolvedValueOnce(null);
    const res = await request(app).delete('/api/tasks/delete/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

// ── Task Categories CRUD ─────────────────────────────────────────────────────
describe('GET /api/task-categories/getAll', () => {
  it('returns 200 and an array of task categories', async () => {
    const res = await request(app).get('/api/task-categories/getAll');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/task-categories/get/:id', () => {
  it('returns 200 and the task category', async () => {
    const res = await request(app).get(`/api/task-categories/get/${mockTaskCategory._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(mockTaskCategory.name);
  });

  it('returns 404 when task category is not found', async () => {
    TaskCategory.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/task-categories/get/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/task-categories/create', () => {
  it('returns 201 and the created task category', async () => {
    const res = await request(app)
      .post('/api/task-categories/create')
      .send({
        name: 'fun',
        count: 0,
        description: '',
        achievements: { completed: 0, busy: 0, waiting: 0 },
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockTaskCategory.name);
  });
});

describe('PUT /api/task-categories/update/:id', () => {
  it('returns 200 and the updated task category', async () => {
    const res = await request(app)
      .put(`/api/task-categories/update/${mockTaskCategory._id}`)
      .send({
        name: 'fun',
        count: 1,
        achievements: { completed: 1, busy: 0, waiting: 0 },
      });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTaskCategory._id);
  });

  it('returns 404 when task category is not found', async () => {
    TaskCategory.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/task-categories/update/000000000000000000000000')
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/task-categories/delete/:id', () => {
  it('returns 200 with success message', async () => {
    const res = await request(app).delete(`/api/task-categories/delete/${mockTaskCategory._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task category deleted successfully');
  });

  it('returns 404 when task category is not found', async () => {
    TaskCategory.findByIdAndDelete.mockResolvedValueOnce(null);
    const res = await request(app).delete('/api/task-categories/delete/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

// ── Users CRUD ───────────────────────────────────────────────────────────────
describe('GET /api/users/getAll', () => {
  it('returns 200 and an array of users', async () => {
    const res = await request(app).get('/api/users/getAll');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/users/get/:id', () => {
  it('returns 200 and the user', async () => {
    const res = await request(app).get(`/api/users/get/${mockUser._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(mockUser.name);
  });

  it('returns 404 when user is not found', async () => {
    User.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/users/get/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/users/create', () => {
  it('returns 201 and the created user', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Candice Bar',
        dob: '1987-04-06T22:00:00.000Z',
        about: 'I am a developer looking to expand my ideals',
        inspirations: [
          {
            inspirations: 'Vivienne Westwood, Yoshitaka Amano, Sephiroth',
            reason: 'to be more bold!',
            url: '',
          },
        ],
        progressUpdatePush: '1 month',
        aspirations: {
          task: ['69d76d7ab3f97a842c094818'],
          fun: ['69d76d7ab3f97a842c094819'],
          new: ['69d76d7ab3f97a842c09481a'],
        },
        achievements: [
          {
            completed: {
              task: [],
              fun: [],
              new: [],
            },
            recognised: ['consistency', 'creativity'],
          },
        ],
        startedDate: '2026-10-03T22:00:00.000Z',
        updatedDate: '2026-10-03T22:00:00.000Z',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockUser.name);
  });
});

describe('PUT /api/users/update/:id', () => {
  it('returns 200 and the updated user', async () => {
    const res = await request(app)
      .put(`/api/users/update/${mockUser._id}`)
      .send({
        about: 'Updated about text',
        progressUpdatePush: '2 weeks',
        aspirations: {
          task: ['69d76d7ab3f97a842c094818'],
          fun: ['69d76d7ab3f97a842c094819'],
          new: ['69d76d7ab3f97a842c09481a'],
        },
        achievements: [
          {
            completed: {
              task: ['69d76d7ab3f97a842c094818'],
              fun: [],
              new: [],
            },
            recognised: ['follow-through', 'kindness'],
          },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockUser._id);

    const [, updatePayload] = User.findByIdAndUpdate.mock.calls.at(-1);
    expect(updatePayload).toEqual(expect.objectContaining({
      about: 'Updated about text',
      progressUpdatePush: '2 weeks',
      aspirations: {
        task: ['69d76d7ab3f97a842c094818'],
        fun: ['69d76d7ab3f97a842c094819'],
        new: ['69d76d7ab3f97a842c09481a'],
      },
      achievements: [
        {
          completed: {
            task: ['69d76d7ab3f97a842c094818'],
            fun: [],
            new: [],
          },
          recognised: ['follow-through', 'kindness'],
        },
      ],
    }));
  });

  it('returns 404 when user is not found', async () => {
    User.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/users/update/000000000000000000000000')
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('POST /api/users/login/google', () => {
  beforeEach(() => {
    User.findOne.mockReset();
    User.findOne.mockResolvedValue(mockUser);
    User.findByIdAndUpdate.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('returns 200 and logs in an existing Google user', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        sub: 'google-user-123',
        email: 'candice@example.com',
        email_verified: 'true',
        name: 'Candice Bar',
        picture: 'https://example.com/avatar.png',
      }),
    });

    const res = await request(app)
      .post('/api/users/login/google')
      .send({ idToken: 'valid-google-token' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Google login successful');
    expect(res.body.isNewUser).toBe(false);
    expect(User.findOne).toHaveBeenCalledWith({
      $or: [
        { googleId: 'google-user-123' },
        { email: 'candice@example.com' },
      ],
    });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      expect.objectContaining({
        name: 'Candice Bar',
        email: 'candice@example.com',
        googleId: 'google-user-123',
        profilePicture: 'https://example.com/avatar.png',
        updatedDate: expect.any(Date),
        lastLoginDate: expect.any(Date),
      }),
      { new: true, runValidators: true }
    );
  });

  it('returns 201 and creates a user when the Google account is new', async () => {
    User.findOne.mockResolvedValueOnce(null);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        sub: 'google-user-456',
        email: 'newuser@example.com',
        email_verified: 'true',
        given_name: 'New',
        family_name: 'User',
        picture: 'https://example.com/new-user.png',
      }),
    });

    const res = await request(app)
      .post('/api/users/login/google')
      .send({ idToken: 'brand-new-google-token' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Google login successful');
    expect(res.body.isNewUser).toBe(true);

    const createdUserPayload = User.mock.calls.at(-1)[0];
    expect(createdUserPayload).toEqual(expect.objectContaining({
      name: 'New User',
      email: 'newuser@example.com',
      googleId: 'google-user-456',
      profilePicture: 'https://example.com/new-user.png',
      startedDate: expect.any(Date),
      updatedDate: expect.any(Date),
      lastLoginDate: expect.any(Date),
    }));
  });

  it('returns 400 when the Google id token is missing', async () => {
    const res = await request(app)
      .post('/api/users/login/google')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Google idToken is required');
  });
});

describe('DELETE /api/users/delete/:id', () => {
  it('returns 200 with success message', async () => {
    const res = await request(app).delete(`/api/users/delete/${mockUser._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('returns 404 when user is not found', async () => {
    User.findByIdAndDelete.mockResolvedValueOnce(null);
    const res = await request(app).delete('/api/users/delete/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

