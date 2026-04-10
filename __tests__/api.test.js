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
  _id: '661f0f1e2f3a4b5c6d7e8f90',
  title: 'Buy groceries',
  description: 'Milk, eggs',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTaskCategory = {
  _id: '661f0f1e2f3a4b5c6d7e8faa',
  name: 'Work',
  description: 'Tasks related to work',
  color: 'blue',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockUser = {
  _id: '661f0f1e2f3a4b5c6d7e8fbb',
  username: 'jdoe',
  email: 'jdoe@example.com',
  displayName: 'Jane Doe',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

jest.mock('../models/task.model', () => {
  const mockSave = jest.fn().mockResolvedValue(mockTask);
  function MockTask(data) {
    Object.assign(this, data);
    this.save = mockSave;
  }
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
  function MockUser(data) {
    Object.assign(this, data);
    this.save = mockSave;
  }
  MockUser.find = jest.fn(() => ({ sort: jest.fn().mockResolvedValue([mockUser]) }));
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
    expect(res.body.title).toBe(mockTask.title);
  });

  it('returns 404 when task is not found', async () => {
    Task.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/tasks/get/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/tasks/create', () => {
  it('returns 201 and the created task', async () => {
    const res = await request(app)
      .post('/api/tasks/create')
      .send({ title: 'Buy groceries', description: 'Milk, eggs' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockTask.title);
  });
});

describe('PUT /api/tasks/update/:id', () => {
  it('returns 200 and the updated task', async () => {
    const res = await request(app)
      .put(`/api/tasks/update/${mockTask._id}`)
      .send({ title: 'Updated title', completed: true });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);
  });

  it('returns 404 when task is not found', async () => {
    Task.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/tasks/update/000000000000000000000000')
      .send({ title: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/delete/:id', () => {
  it('returns 200 with success message', async () => {
    const res = await request(app).delete(`/api/tasks/delete/${mockTask._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  it('returns 404 when task is not found', async () => {
    Task.findByIdAndDelete.mockResolvedValueOnce(null);
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
      .send({ name: 'Work', description: 'Tasks related to work' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockTaskCategory.name);
  });
});

describe('PUT /api/task-categories/update/:id', () => {
  it('returns 200 and the updated task category', async () => {
    const res = await request(app)
      .put(`/api/task-categories/update/${mockTaskCategory._id}`)
      .send({ name: 'Home', color: 'green' });
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
    expect(res.body.username).toBe(mockUser.username);
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
      .send({ username: 'jdoe', email: 'jdoe@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe(mockUser.username);
  });
});

describe('PUT /api/users/update/:id', () => {
  it('returns 200 and the updated user', async () => {
    const res = await request(app)
      .put(`/api/users/update/${mockUser._id}`)
      .send({ displayName: 'Updated Name', active: false });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockUser._id);
  });

  it('returns 404 when user is not found', async () => {
    User.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/users/update/000000000000000000000000')
      .send({ username: 'x' });
    expect(res.status).toBe(404);
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

