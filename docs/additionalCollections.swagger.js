/**
 * Swagger/OpenAPI docs for task categories and users.
 */

/**
 * @swagger
 * tags:
 *   - name: Task Categories
 *     description: Task category management endpoints
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         count:
 *           type: integer
 *         description:
 *           type: string
 *         achievements:
 *           type: object
 *           properties:
 *             completed:
 *               type: integer
 *             busy:
 *               type: integer
 *             waiting:
 *               type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 69d769a5b3f97a842c094800
 *         name: fun
 *         count: 0
 *         description: ''
 *         achievements:
 *           completed: 0
 *           busy: 0
 *           waiting: 0
 *     TaskCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         count:
 *           type: integer
 *         description:
 *           type: string
 *         achievements:
 *           type: object
 *           properties:
 *             completed:
 *               type: integer
 *             busy:
 *               type: integer
 *             waiting:
 *               type: integer
 *       example:
 *         name: fun
 *         count: 0
 *         description: ''
 *         achievements:
 *           completed: 0
 *           busy: 0
 *           waiting: 0
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         dob:
 *           type: string
 *           format: date-time
 *         about:
 *           type: string
 *         inspirations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               inspirations:
 *                 type: string
 *               reason:
 *                 type: string
 *               url:
 *                 type: string
 *         progressUpdatePush:
 *           type: string
 *         achievements:
 *           type: object
 *           properties:
 *             completed:
 *               type: object
 *               properties:
 *                 task:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fun:
 *                   type: array
 *                   items:
 *                     type: string
 *                 new:
 *                   type: array
 *                   items:
 *                     type: string
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 69d7663ab3f97a842c0947fc
 *         name: Candice Bar
 *         dob: 1987-04-06T22:00:00.000Z
 *         about: I am a developer looking to expand my ideals
 *         inspirations:
 *           - inspirations: Vivienne Westwood, Yoshitaka Amano, Sephiroth
 *             reason: to be more bold!
 *             url: ''
 *         progressUpdatePush: 1 month
 *         achievements:
 *           completed:
 *             task: []
 *             fun: []
 *             new: []
 *         startedDate: 2026-10-03T22:00:00.000Z
 *         updatedDate: 2026-10-03T22:00:00.000Z
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         dob:
 *           type: string
 *           format: date-time
 *         about:
 *           type: string
 *         inspirations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               inspirations:
 *                 type: string
 *               reason:
 *                 type: string
 *               url:
 *                 type: string
 *         progressUpdatePush:
 *           type: string
 *         achievements:
 *           type: object
 *           properties:
 *             completed:
 *               type: object
 *               properties:
 *                 task:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fun:
 *                   type: array
 *                   items:
 *                     type: string
 *                 new:
 *                   type: array
 *                   items:
 *                     type: string
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *       example:
 *         name: Candice Bar
 *         dob: 1987-04-06T22:00:00.000Z
 *         about: I am a developer looking to expand my ideals
 *         inspirations:
 *           - inspirations: Vivienne Westwood, Yoshitaka Amano, Sephiroth
 *             reason: to be more bold!
 *             url: ''
 *         progressUpdatePush: 1 month
 *         achievements:
 *           completed:
 *             task: []
 *             fun: []
 *             new: []
 *         startedDate: 2026-10-03T22:00:00.000Z
 *         updatedDate: 2026-10-03T22:00:00.000Z
 */

/**
 * @swagger
 * /api/task-categories/getAll:
 *   get:
 *     summary: Retrieve all task categories
 *     tags: [Task Categories]
 *     responses:
 *       200:
 *         description: A list of task categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskCategory'
 */

/**
 * @swagger
 * /api/task-categories/get/{id}:
 *   get:
 *     summary: Retrieve a single task category by ID
 *     tags: [Task Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskCategory'
 *       404:
 *         description: Task category not found
 */

/**
 * @swagger
 * /api/task-categories/create:
 *   post:
 *     summary: Create a new task category
 *     tags: [Task Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCategoryInput'
 *     responses:
 *       201:
 *         description: Task category created successfully
 */

/**
 * @swagger
 * /api/task-categories/update/{id}:
 *   put:
 *     summary: Update a task category by ID
 *     tags: [Task Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCategoryInput'
 *     responses:
 *       200:
 *         description: Task category updated successfully
 *       404:
 *         description: Task category not found
 */

/**
 * @swagger
 * /api/task-categories/delete/{id}:
 *   delete:
 *     summary: Delete a task category by ID
 *     tags: [Task Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task category deleted successfully
 *       404:
 *         description: Task category not found
 */

/**
 * @swagger
 * /api/users/getAll:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/users/get/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
