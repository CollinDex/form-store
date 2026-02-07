/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     # ----------------------------------
 *     # AUTH SCHEMAS
 *     # ----------------------------------
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Role of the user in the system
 *       required:
 *         - id
 *         - username
 *         - email
 *         - role
 *     
 *     # ----------------------------------
 *     # FORM SCHEMAS
 *     # ----------------------------------
 *     Form:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the form
 *         title:
 *           type: string
 *           example: "Sunday Service Check-in"
 *           description: Title of the form
 *         slug:
 *           type: string
 *           example: "sunday-service-2026"
 *           description: URL-friendly identifier for the form
 *         description:
 *           type: string
 *           example: "Weekly attendance form for members."
 *           description: Brief description of the form's purpose
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the form was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the form was last updated
 *       required:
 *         - id
 *         - title
 *         - slug
 *     
 *     FormField:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           example: "full_name"
 *           description: Unique identifier for the field
 *         label:
 *           type: string
 *           example: "Full Name"
 *           description: Display label for the field
 *         type:
 *           type: string
 *           enum: [text, number, email, select, checkbox]
 *           description: Type of input field
 *         required:
 *           type: boolean
 *           default: false
 *           description: Whether this field is required
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Available options (for select fields)
 *       required:
 *         - key
 *         - label
 *         - type
 *     
 *     FormVersion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the version
 *         formId:
 *           type: string
 *           format: uuid
 *           description: ID of the parent form
 *         version:
 *           type: integer
 *           example: 1
 *           description: Version number (incremental)
 *         schema:
 *           type: object
 *           properties:
 *             fields:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormField'
 *           description: The JSON schema defining the form fields
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when this version was published
 *       required:
 *         - id
 *         - formId
 *         - version
 *         - schema
 *     
 *     Submission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the submission
 *         versionId:
 *           type: string
 *           format: uuid
 *           description: ID of the form version used
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who submitted
 *         answers:
 *           type: object
 *           description: Key-value pairs of user responses
 *           example:
 *             full_name: "Chibuikem"
 *             department: "Choir"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the submission was created
 *       required:
 *         - id
 *         - versionId
 *         - answers
 *     
 *     # ----------------------------------
 *     # RESPONSE SCHEMAS
 *     # ----------------------------------
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           description: JWT Bearer token for authentication
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *         message:
 *           type: string
 *           description: Detailed error description
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and registration
 *   - name: Forms
 *     description: Admin operations for managing forms and versions
 *   - name: Submissions
 *     description: User operations for submitting and viewing form responses
 */

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username, email, and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Chibuikem"
 *                 description: Unique username for the account
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dex@example.com"
 *                 description: Valid email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "securePassword123"
 *                 description: Strong password (minimum 8 characters)
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 default: USER
 *                 example: "USER"
 *                 description: User role (defaults to USER)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error (invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticate a user with email and password, returns JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dex@example.com"
 *                 description: Registered email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials (wrong email or password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ==========================================
// FORM MANAGEMENT (ADMIN)
// ==========================================

/**
 * @swagger
 * /forms:
 *   post:
 *     summary: Create a new form
 *     description: Create a new form template (Admin only)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sunday Service Check-in"
 *                 description: Display title for the form
 *               slug:
 *                 type: string
 *                 example: "sunday-service-2026"
 *                 description: URL-friendly unique identifier
 *               description:
 *                 type: string
 *                 example: "Weekly attendance form for members"
 *                 description: Optional description of the form
 *     responses:
 *       201:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Form created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Form'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user is not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /forms/{id}/versions:
 *   post:
 *     summary: Create a new version for a form
 *     description: Publish a new version with updated schema for an existing form (Admin only)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schema
 *             properties:
 *               schema:
 *                 type: object
 *                 required:
 *                   - fields
 *                 properties:
 *                   fields:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/FormField'
 *                     example:
 *                       - key: "full_name"
 *                         label: "Full Name"
 *                         type: "text"
 *                         required: true
 *                       - key: "email"
 *                         label: "Email Address"
 *                         type: "email"
 *                         required: true
 *                       - key: "department"
 *                         label: "Department"
 *                         type: "select"
 *                         required: false
 *                         options: ["Choir", "Ushering", "Media", "Children"]
 *     responses:
 *       201:
 *         description: New version published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FormVersion'
 *       400:
 *         description: Validation error (invalid schema)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Form not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ==========================================
// FORM SUBMISSION (USER/PUBLIC)
// ==========================================

/**
 * @swagger
 * /forms/{slug}:
 *   get:
 *     summary: Get form by slug (public)
 *     description: Retrieve the latest version of a form by its slug for rendering (accessible to authenticated users)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL-friendly slug of the form
 *         example: "sunday-service-2026"
 *     responses:
 *       200:
 *         description: Form details and latest version schema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 form:
 *                   $ref: '#/components/schemas/Form'
 *                 version:
 *                   $ref: '#/components/schemas/FormVersion'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Form not found or no published versions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ==========================================
// SUBMISSIONS
// ==========================================

/**
 * @swagger
 * /submissions/{versionId}:
 *   post:
 *     summary: Submit a form response
 *     description: Submit answers to a specific form version (authenticated users)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the form version
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: object
 *                 description: Key-value pairs matching the form schema fields
 *                 example:
 *                   full_name: "Dex"
 *                   email: "dex@example.com"
 *                   department: "Choir"
 *                   age: 25
 *     responses:
 *       201:
 *         description: Submission received successfully and notification email queued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Submission received successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: ID of the created submission
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error (missing required fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Form version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /forms/{formId}/submissions:
 *   get:
 *     summary: Get all submissions for a form
 *     description: Retrieve all submissions for a specific form across all versions (Admin only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the form
 *       - in: query
 *         name: versionId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific version (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of submissions per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *                 total:
 *                   type: integer
 *                   description: Total number of submissions
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Items per page
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user is not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Form not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */



export {};