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
 *         email:
 *           type: string
 *           format: email
 *         googleId:
 *           type: string
 *         profilePicture:
 *           type: string
 *         authProvider:
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
 *         status:
 *           type: string
 *           description: User status
 *           enum: [friend, friend_new, friend_dear, friend_close, confidant]
*         progressUpdatePush:
*           type: object
*           properties:
*             schedule:
*               type: string
*               enum: [daily, weekly, monthly]
*               default: monthly
*             lastUpdatedDate:
*               type: string
*               description: ISO date string
*             lastUpdateSent:
*               type: string
*               description: ISO date string
*             updatedDate:
*               type: string
*               description: ISO date string
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
 *         startedDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *         lastLoginDate:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 69d977b8abda6e6ee0cc1f29
 *         name: Candice Bar
 *         email: candice@example.com
 *         googleId: google-user-123
 *         profilePicture: https://example.com/avatar.png
 *         authProvider: google
 *         dob: 1987-04-06T22:00:00.000Z
 *         about: I am a developer looking to expand my ideals
 *         inspirations:
 *           - inspirations: Vivienne Westwood, Yoshitaka Amano, Sephiroth
 *             reason: to be more bold!
 *             url: ''
 *         progressUpdatePush: 
 *           schedule: "monthly",
 *           lastUpdatedDate: "2026-10-03T22:00:00.000Z",
 *           lastUpdateSent: "2026-10-03T22:00:00.000Z",
 *           updatedDate: "2026-10-03T22:00:00.000Z",
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
 *             createdAt: 2026-10-03T22:00:00.000Z
 *             completedAt: 2026-10-04T22:00:00.000Z
 *         startedDate: 2026-10-03T22:00:00.000Z
 *         updatedDate: 2026-10-03T22:00:00.000Z
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         googleId:
 *           type: string
 *         profilePicture:
 *           type: string
 *         authProvider:
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
 *         status:
 *           type: string
 *           description: User status
 *           enum: [friend, friend_new, friend_dear, friend_close, confidant]
 *         progressUpdatePush:
*           type: object
*           properties:
*             schedule:
*               type: string
*               enum: [daily, weekly, monthly]
*               default: monthly
*             lastUpdatedDate:
*               type: string
*               description: ISO date string
*             lastUpdateSent:
*               type: string
*               description: ISO date string
*             updatedDate:
*               type: string
*               description: ISO date string
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
 *         lastLoginDate:
 *           type: string
 *           format: date-time
 *       example:
 *         name: Candice Bar
 *         email: candice@example.com
 *         googleId: google-user-123
 *         profilePicture: https://example.com/avatar.png
 *         authProvider: google
 *         dob: 1987-04-06T22:00:00.000Z
 *         about: I am a developer looking to expand my ideals
 *         inspirations:
 *           - inspirations: Vivienne Westwood, Yoshitaka Amano, Sephiroth
 *             reason: to be more bold!
 *             url: ''
 *         progressUpdatePush:
 *           schedule: "monthly",
 *           lastUpdatedDate: "2026-10-03T22:00:00.000Z",
 *           lastUpdateSent: "2026-10-03T22:00:00.000Z",
 *           updatedDate: "2026-10-03T22:00:00.000Z",
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
* /api/users/achievement/{userId}/{achievementIndex}:
 *   patch:
 *     summary: Add achievements to a user's achievements.recognised array
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: achievementIndex
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - achievementIds
 *             properties:
 *               achievementIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Achievement ObjectId
 *     responses:
 *       200:
 *         description: Achievements added to recognised
 *       400:
 *         description: achievementIds missing or invalid
 *       404:
 *         description: User or achievement entry not found
 */

/**
 * @swagger
 * /api/users/update-status/{id}:
 *   patch:
 *     summary: Update only the user's status
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
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [friend, friend_new, friend_dear, friend_close, confidant]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: User not found
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
 * /api/users/login/google:
 *   post:
 *     summary: Log in with Google Sign-In
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token returned by the frontend sign-in flow
 *     responses:
 *       200:
 *         description: Existing user logged in successfully
 *       201:
 *         description: New user created from Google profile and logged in successfully
 *       400:
 *         description: Missing Google token
 *       401:
 *         description: Invalid or unverified Google token
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
