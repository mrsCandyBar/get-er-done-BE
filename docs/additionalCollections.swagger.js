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
 *         description:
 *           type: string
 *         color:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 661f0f1e2f3a4b5c6d7e8faa
 *         name: Work
 *         description: Tasks related to work
 *         color: blue
 *     TaskCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         color:
 *           type: string
 *       example:
 *         name: Work
 *         description: Tasks related to work
 *         color: blue
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         displayName:
 *           type: string
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 661f0f1e2f3a4b5c6d7e8fbb
 *         username: jdoe
 *         email: jdoe@example.com
 *         displayName: Jane Doe
 *         active: true
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         displayName:
 *           type: string
 *         active:
 *           type: boolean
 *       example:
 *         username: jdoe
 *         email: jdoe@example.com
 *         displayName: Jane Doe
 *         active: true
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
