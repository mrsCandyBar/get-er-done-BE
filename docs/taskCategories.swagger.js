/**
 * Swagger/OpenAPI docs for task category routes.
 */

/**
 * @swagger
 * tags:
 *   - name: Task Categories
 *     description: Task category management endpoints
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
