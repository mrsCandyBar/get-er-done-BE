require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const db = require('./db/connection');
const tasksRouter = require('./routes/tasks');
const taskCategoriesRouter = require('./routes/taskCategories');
const usersRouter = require('./routes/users');
const recurringTasksRouter = require('./routes/recurringTasks');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// ── Info / Home page ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Get-Er-Done API</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 700px;
      margin: 60px auto;
      padding: 0 20px;
      color: #333;
      line-height: 1.5;
    }
    h1 { color: #2c3e50; }
    a {
      color: #2980b9;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 16px;
      margin-bottom: 12px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
      vertical-align: top;
    }
    th { background-color: #f4f6f8; }
    pre {
      background: #f8f8f8;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    .quick-links,
    .section-nav {
      padding-left: 18px;
      margin-top: 8px;
    }
    .section-card {
      margin-top: 24px;
    }
    .section-label {
      margin: 8px 0 0;
      font-weight: bold;
      color: #2c3e50;
    }
  </style>
</head>
<body>
  <h1>🗂️ Get-Er-Done API</h1>
  <p>A task management REST API built with <strong>Express.js</strong> and <strong>MongoDB</strong>.</p>

  <h2>Quick Links</h2>
  <ul class="quick-links">
    <li><a href="/api-docs">📖 Interactive API Docs</a></li>
    <li><a href="/api-docs.json">🔗 OpenAPI JSON</a></li>
  </ul>

  <h2>Jump to Section</h2>
  <ul class="section-nav">
    <li><a href="#tasks">Tasks</a></li>
    <li><a href="#task-categories">Task Categories</a></li>
    <li><a href="#users">Users</a></li>
  </ul>

  <h2>Available Endpoints</h2>

  <section id="tasks" class="section-card">
  <h3>Tasks</h3>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Path</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>GET</td>    <td><code>/api/tasks/getAll</code></td>              <td>Retrieve all tasks</td></tr>
      <tr><td>GET</td>    <td><code>/api/tasks/get/:id</code></td>             <td>Retrieve a single task</td></tr>
      <tr><td>POST</td>   <td><code>/api/tasks/create</code></td>              <td>Create a new task</td></tr>
      <tr><td>PUT</td>    <td><code>/api/tasks/update/:id</code></td>          <td>Update a task</td></tr>
      <tr><td>PUT</td>    <td><code>/api/tasks/startTask/:id</code></td>       <td>Start a task and move category progress into busy</td></tr>
      <tr><td>PUT</td>    <td><code>/api/tasks/pauseTask/:id</code></td>       <td>Pause a task and move category progress back to waiting</td></tr>
      <tr><td>PUT</td>    <td><code>/api/tasks/completeTask/:id</code></td>    <td>Update only the completed object and update date</td></tr>
      <tr><td>DELETE</td> <td><code>/api/tasks/delete/:id</code></td>          <td>Delete a task</td></tr>
    </tbody>
  </table>
  <p class="section-label">Task Object</p>
  <pre><code>{
  "_id":         "string (MongoDB ObjectId)",
  "name":        "string (required)",
  "description": "string (optional)",
  "createdDate": "date",
  "startedDate": "date | null",
  "updatedDate": "date | null",
  "recur":       ["string"],
  "completed": {  "optional once completed"
    "completedDate": "date | null",
    "finalNotes":    "string",
    "recur":         "boolean"
  },
  "category":    "string (taskCategoryId)",
  "userId":      "string (userId)"
}</code></pre>
  </section>

  <section id="task-categories" class="section-card">
  <h3>Task Categories</h3>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Path</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>GET</td>    <td><code>/api/task-categories/getAll</code></td>    <td>Retrieve all task categories</td></tr>
      <tr><td>GET</td>    <td><code>/api/task-categories/get/:id</code></td>   <td>Retrieve a single task category</td></tr>
      <tr><td>POST</td>   <td><code>/api/task-categories/create</code></td>    <td>Create a task category</td></tr>
      <tr><td>PUT</td>    <td><code>/api/task-categories/update/:id</code></td><td>Update a task category</td></tr>
      <tr><td>DELETE</td> <td><code>/api/task-categories/delete/:id</code></td><td>Delete a task category</td></tr>
    </tbody>
  </table>
  <p class="section-label">Task Category Object</p>
  <pre><code>{
  "_id":         "string (MongoDB ObjectId)",
  "name":        "string",
  "count":       0,
  "description": "string",
  "achievements": {
    "completed": 0,
    "busy":      0,
    "waiting":   0
  }
}</code></pre>
  </section>

  <section id="users" class="section-card">
  <h3>Users</h3>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Path</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>GET</td>    <td><code>/api/users/getAll</code></td>              <td>Retrieve all users</td></tr>
      <tr><td>GET</td>    <td><code>/api/users/get/:id</code></td>             <td>Retrieve a single user</td></tr>
      <tr><td>POST</td>   <td><code>/api/users/create</code></td>              <td>Create a user</td></tr>
      <tr><td>POST</td>   <td><code>/api/users/login/google</code></td>        <td>Verify a Google Sign-In token and log in or create a user</td></tr>
      <tr><td>PUT</td>    <td><code>/api/users/update/:id</code></td>          <td>Update a user</td></tr>
      <tr><td>DELETE</td> <td><code>/api/users/delete/:id</code></td>          <td>Delete a user</td></tr>
    </tbody>
  </table>
  <p class="section-label">User Object</p>
  <pre><code>{
  "_id":               "string (MongoDB ObjectId)",
  "name":              "string",
  "dob":               "date",
  "about":             "string",
  "inspirations": [
    {
      "inspirations":  "string",
      "reason":        "string",
      "url":           "string"
    }
  ],
  "progressUpdatePush": "string",
  "aspirations": {
    "task": ["taskId"],
    "fun":  ["taskId"],
    "new":  ["taskId"]
  },
  "achievements": [
    {
      "completed": {
        "task": ["taskId"],
        "fun":  ["taskId"],
        "new":  ["taskId"]
      },
      "recognised": ["string"]
    }
  ],
  "startedDate":       "date",
  "updatedDate":       "date"
}</code></pre>
  </section>
</body>
</html>`);
});

// ── Swagger ───────────────────────────────────────────────────────────────────
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/tasks', tasksRouter);
app.use('/api/task-categories', taskCategoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/recurring-tasks', recurringTasksRouter);

// ── Start (only when run directly, not when required by tests) ────────────────
if (require.main === module) {
  db.connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;

