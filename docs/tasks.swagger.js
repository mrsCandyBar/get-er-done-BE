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
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *         recur:
 *           type: array
 *           items:
 *             type: string
*         recurId:
*           type: array
*           items:
*             type: string
*           description: Array of RecurringTask IDs this task is associated with
 *         completed:
*           type: object
*           properties:
*             mood:
*               type: string
*               description: Mood after completing the task
*               enum: [happy, love, not-sure, confused, not-for-me]
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
 *         startedDate: 2026-10-04T09:00:00.000Z
 *         updatedDate: 2026-10-05T12:30:00.000Z
 *         recur: []
*         recurId: [6628e7b2c1a4e2a1b8c1d2e3]
 *         completed:
*           mood: happy
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
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *         recur:
 *           type: array
 *           items:
 *             type: string
*         recurId:
*           type: array
*           items:
*             type: string
*           description: Array of RecurringTask IDs this task is associated with
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
 *         userId:
 *           type: string
 *           description: User ID used to update the matching aspiration bucket when the task is created
 *       example:
 *         name: Complete Git-er-done
 *         description: get her off the ground!
 *         startedDate: 2026-10-04T09:00:00.000Z
 *         updatedDate: 2026-10-05T12:30:00.000Z
 *         recur: []
*         recurId: [6628e7b2c1a4e2a1b8c1d2e3]
 *         completed:
 *           completedDate: 2026-10-03T22:00:00.000Z
 *           finalNotes: will do this again!
 *           recur: true
 *         category: 69d769a5b3f97a842c094800
 *         userId: 69d977b8abda6e6ee0cc1f29
 *     TaskStartInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID used to refresh the related user's updatedDate when the task is started
 *       example:
 *         userId: 69d977b8abda6e6ee0cc1f29
 *     TaskPauseInput:
 *       type: object
 *       description: No request body fields are required; the server sets the task updated date automatically
 *       example: {}
 *     TaskDeleteInput:
 *       type: object
 *       properties:
 *         achievementProperty:
 *           type: string
 *           enum: [busy, waiting]
 *           description: Explicitly chooses which task-category achievement bucket to decrement before deletion
 *       example:
 *         achievementProperty: waiting
 *     TaskCompleteInput:
 *       type: object
 *       properties:
 *         finalNotes:
 *           type: string
 *           description: Notes captured when the task is completed
 *         recur:
 *           type: boolean
 *           description: When true, the server creates a new recurring task from the completed task
 *         userId:
 *           type: string
 *           description: Optional user ID fallback when the task does not already store one
 *       example:
 *         finalNotes: finished strong
 *         recur: true
 *         userId: 69d977b8abda6e6ee0cc1f29
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
* /api/tasks/start/{id}:
 *   put:
 *     summary: Update the task start dates and sync the related category/user progress state
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
 *             $ref: '#/components/schemas/TaskStartInput'
 *     responses:
 *       200:
 *         description: Task start fields updated successfully
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
* /api/tasks/pause/{id}:
 *   put:
 *     summary: Pause a task and move the related category progress from busy back to waiting
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskPauseInput'
 *     responses:
 *       200:
 *         description: Task paused successfully
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
* /api/tasks/complete/{id}:
 *   put:
 *     summary: Complete a task, update related user/category progress, and optionally create a recurring follow-up task
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
 *             $ref: '#/components/schemas/TaskCompleteInput'
 *     responses:
 *       200:
 *         description: Task completion fields updated successfully
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
 *     summary: Delete a task by ID when it has not been completed yet
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskDeleteInput'
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
 *       400:
 *         description: Completed tasks cannot be deleted
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
