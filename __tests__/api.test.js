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

const app = require('../server');
const Task = require('../models/task.model');

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
describe('GET /api/tasks', () => {
  it('returns 200 and an array of tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns 200 and the task', async () => {
    const res = await request(app).get(`/api/tasks/${mockTask._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(mockTask.title);
  });

  it('returns 404 when task is not found', async () => {
    Task.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/tasks/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/tasks', () => {
  it('returns 201 and the created task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Buy groceries', description: 'Milk, eggs' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockTask.title);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('returns 200 and the updated task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${mockTask._id}`)
      .send({ title: 'Updated title', completed: true });
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mockTask._id);
  });

  it('returns 404 when task is not found', async () => {
    Task.findByIdAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/tasks/000000000000000000000000')
      .send({ title: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('returns 200 with success message', async () => {
    const res = await request(app).delete(`/api/tasks/${mockTask._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  it('returns 404 when task is not found', async () => {
    Task.findByIdAndDelete.mockResolvedValueOnce(null);
    const res = await request(app).delete('/api/tasks/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

