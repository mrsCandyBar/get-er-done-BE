/**
 * Swagger/OpenAPI docs for user routes.
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *         aspirations:
 *           type: object
 *           properties:
 *             task:
 *               type: array
 *               items:
 *                 type: string
 *             fun:
 *               type: array
 *               items:
 *                 type: string
 *             new:
 *               type: array
 *               items:
 *                 type: string
 *         achievements:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               completed:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: array
 *                     items:
 *                       type: string
 *                   fun:
 *                     type: array
 *                     items:
 *                       type: string
 *                   new:
 *                     type: array
 *                     items:
 *                       type: string
 *               recognised:
 *                 type: array
 *                 items:
 *                   type: string
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 69d977b8abda6e6ee0cc1f29
 *         name: Candice Bar
 *         dob: 1987-04-06T22:00:00.000Z
 *         about: I am a developer looking to expand my ideals
 *         inspirations:
 *           - inspirations: Vivienne Westwood, Yoshitaka Amano, Sephiroth
 *             reason: to be more bold!
 *             url: ''
 *         progressUpdatePush: 1 month
 *         aspirations:
 *           task: [69d76d7ab3f97a842c094818]
 *           fun: [69d76d7ab3f97a842c094819]
 *           new: [69d76d7ab3f97a842c09481a]
 *         achievements:
 *           - completed:
 *               task: []
 *               fun: []
 *               new: []
 *             recognised:
 *               - consistency
 *               - creativity
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
 *         aspirations:
 *           type: object
 *           properties:
 *             task:
 *               type: array
 *               items:
 *                 type: string
 *             fun:
 *               type: array
 *               items:
 *                 type: string
 *             new:
 *               type: array
 *               items:
 *                 type: string
 *         achievements:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               completed:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: array
 *                     items:
 *                       type: string
 *                   fun:
 *                     type: array
 *                     items:
 *                       type: string
 *                   new:
 *                     type: array
 *                     items:
 *                       type: string
 *               recognised:
 *                 type: array
 *                 items:
 *                   type: string
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
 *         aspirations:
 *           task: [69d76d7ab3f97a842c094818]
 *           fun: [69d76d7ab3f97a842c094819]
 *           new: [69d76d7ab3f97a842c09481a]
 *         achievements:
 *           - completed:
 *               task: []
 *               fun: []
 *               new: []
 *             recognised:
 *               - consistency
 *               - creativity
 *         startedDate: 2026-10-03T22:00:00.000Z
 *         updatedDate: 2026-10-03T22:00:00.000Z
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
