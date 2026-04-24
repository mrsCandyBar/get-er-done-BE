/**
 * @swagger
 * tags:
 *   - name: Achievements
 *     description: Achievement management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         tagline:
 *           type: string
 *         goal:
 *           type: array
 *           items:
 *             type: string
 *         gainedFrom:
 *           type: string
 *       example:
 *         _id: 1234567890abcdef12345678
 *         title: "First Steps"
 *         description: "Completed your first task."
 *         tagline: "Getting started!"
 *         goal: ["Complete a task"]
 *         gainedFrom: "tasks"
 *     AchievementInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         tagline:
 *           type: string
 *         goal:
 *           type: array
 *           items:
 *             type: string
 *         gainedFrom:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - tagline
 *         - goal
 *         - gainedFrom
 */

/**
 * @swagger
 * /api/achievements/create:
 *   post:
 *     summary: Create a new achievement
 *     tags: [Achievements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AchievementInput'
 *     responses:
 *       201:
 *         description: Achievement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 */

/**
 * @swagger
 * /api/achievements/getAll:
 *   get:
 *     summary: Retrieve all achievements
 *     tags: [Achievements]
 *     responses:
 *       200:
 *         description: A list of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 */

/**
 * @swagger
 * /api/achievements/get/{id}:
 *   get:
 *     summary: Retrieve a single achievement by ID
 *     tags: [Achievements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An achievement object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: Achievement not found
 */

/**
 * @swagger
 * /api/achievements/update/{id}:
 *   put:
 *     summary: Update an achievement by ID
 *     tags: [Achievements]
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
 *             $ref: '#/components/schemas/AchievementInput'
 *     responses:
 *       200:
 *         description: Achievement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: Achievement not found
 */

/**
 * @swagger
 * /api/achievements/delete/{id}:
 *   delete:
 *     summary: Delete an achievement by ID
 *     tags: [Achievements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Achievement deleted successfully
 *       404:
 *         description: Achievement not found
 */
