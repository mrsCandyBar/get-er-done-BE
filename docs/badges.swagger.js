/**
 * @swagger
 * tags:
 *   - name: Badges
 *     description: Badge management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Badge:
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
 *         gainedFrom:
 *           type: string
 *         physicalTrait:
 *           type: object
 *           properties:
 *             icon:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *                 textSizes:
 *                   type: object
 *                   properties:
 *                     round:
 *                       type: number
 *                     symbol:
 *                       type: number
 *             label:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                 textSticker:
 *                   type: array
 *                   items:
 *                     type: string
 *                 offset_round:
 *                   type: number
 *                 offset_round_full:
 *                   type: number
 *                 labelWidth:
 *                   type: number
 *                 labelHeight:
 *                   type: number
 *                 textSizes:
 *                   type: object
 *                   properties:
 *                     round:
 *                       type: array
 *                       items:
 *                         type: number
 *                     text:
 *                       type: array
 *                       items:
 *                         type: number
 *             subtitle:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                 offset_round:
 *                   type: number
 *                 offset_round_full:
 *                   type: number
 *                 textSizes:
 *                   type: object
 *                   properties:
 *                     round:
 *                       type: array
 *                       items:
 *                         type: number
 *             color:
 *               type: object
 *               properties:
 *                 accent:
 *                   type: string
 *                 contrast:
 *                   type: string
 *       example:
 *         _id: 1234567890abcdef12345678
 *         title: "First Badge"
 *         description: "Completed your first milestone."
 *         tagline: "You earned it!"
 *         gainedFrom: "tasks"
 *         physicalTrait:
 *           icon:
 *             value: "star"
 *             width: 48
 *             height: 48
 *             textSizes:
 *               round: 24
 *               symbol: 20
 *           label:
 *             value: "Milestone"
 *             textSticker: ["first", "win"]
 *             offset_round: 6
 *             offset_round_full: 12
 *             labelWidth: 140
 *             labelHeight: 36
 *             textSizes:
 *               round: [12, 14]
 *               text: [10, 12]
 *           subtitle:
 *             value: "Level 1"
 *             offset_round: 4
 *             offset_round_full: 10
 *             textSizes:
 *               round: [8, 10]
 *           color:
 *             accent: "#f5a623"
 *             contrast: "#1f2937"
 *     BadgeInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         tagline:
 *           type: string
 *         gainedFrom:
 *           type: string
 *         physicalTrait:
 *           $ref: '#/components/schemas/Badge/properties/physicalTrait'
 *       required:
 *         - title
 *         - description
 *         - tagline
 *         - gainedFrom
 */

/**
 * @swagger
 * /api/badges/create:
 *   post:
 *     summary: Create a new badge
 *     tags: [Badges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       201:
 *         description: Badge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 */

/**
 * @swagger
 * /api/badges/getAll:
 *   get:
 *     summary: Retrieve all badges
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: A list of badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 */

/**
 * @swagger
 * /api/badges/get/{id}:
 *   get:
 *     summary: Retrieve a single badge by ID
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A badge object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       404:
 *         description: Badge not found
 */

/**
 * @swagger
 * /api/badges/update/{id}:
 *   put:
 *     summary: Update a badge by ID
 *     tags: [Badges]
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
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       200:
 *         description: Badge updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       404:
 *         description: Badge not found
 */

/**
 * @swagger
 * /api/badges/delete/{id}:
 *   delete:
 *     summary: Delete a badge by ID
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Badge deleted successfully
 *       404:
 *         description: Badge not found
 */
