/**
 * Swagger/OpenAPI docs for task routes.
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Name of the task
 *         description:
 *           type: string
 *           description: Optional description of the task
 *         createdDate:
 *           type: string
 *           format: date-time
 *         recur:
 *           type: array
 *           items:
 *             type: string
 *         completed:
 *           type: object
 *           properties:
 *             completedDate:
 *               type: string
 *               format: date-time
 *             finalNotes:
 *               type: string
 *             recur:
 *               type: boolean
 *         category:
 *           type: string
 *           description: Related task category ID
 *       example:
 *         _id: 69d76d7ab3f97a842c094818
 *         name: Complete Git-er-done
 *         description: get her off the ground!
 *         createdDate: 2026-10-03T22:00:00.000Z
 *         recur: []
 *         completed:
 *           completedDate: 2026-10-03T22:00:00.000Z
 *           finalNotes: will do this again!
 *           recur: true
 *         category: 69d769a5b3f97a842c094800
 *     TaskInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdDate:
 *           type: string
 *           format: date-time
 *         recur:
 *           type: array
 *           items:
 *             type: string
 *         completed:
 *           type: object
 *           properties:
 *             completedDate:
 *               type: string
 *               format: date-time
 *             finalNotes:
 *               type: string
 *             recur:
 *               type: boolean
 *         category:
 *           type: string
 *           description: Task category ID
 *       example:
 *         name: Complete Git-er-done
 *         description: get her off the ground!
 *         createdDate: 2026-10-03T22:00:00.000Z
 *         recur: []
 *         completed:
 *           completedDate: 2026-10-03T22:00:00.000Z
 *           finalNotes: will do this again!
 *           recur: true
 *         category: 69d769a5b3f97a842c094800
 */

/**
 * @swagger
 * /api/tasks/getAll:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/get/{id}:
 *   get:
 *     summary: Retrieve a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: A task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/update/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/delete/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
