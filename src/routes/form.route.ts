import { Router } from 'express';
import { FormController, SubmissionController } from '../controllers/index';
import { checkRole, validateRequest, validateDynamicSchema, authMiddleware } from '../middleware/index';
import { UserRole } from '../types';
import {
	addVersionSchema,
	createFormSchema,
	getFormSchema,
	getSubmissionsSchema,
	submitResponseSchema
} from '../validation-schema/form.schema';

const formRoute = Router();

const formController = new FormController();
const submissionController = new SubmissionController();

// =============================================================================
// SWAGGER COMPONENTS & TAGS
// =============================================================================

/**
 * @swagger
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 * schemas:
 * Form:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * title:
 * type: string
 * example: "Sunday Service Check-in"
 * slug:
 * type: string
 * example: "sunday-service-2026"
 * description:
 * type: string
 * example: "Weekly attendance form for members."
 * FormVersion:
 * type: object
 * properties:
 * version:
 * type: integer
 * example: 1
 * schema:
 * type: object
 * description: The JSON schema defining the fields
 * example:
 * fields:
 * - key: "full_name"
 * label: "Full Name"
 * type: "text"
 * required: true
 * Submission:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * answers:
 * type: object
 * description: The user's responses
 * example:
 * full_name: "Chibuikem"
 * department: "Choir"
 */

/**
 * @swagger
 * tags:
 * - name: Forms
 * description: Admin operations for managing forms
 * - name: Submissions
 * description: User operations for submitting data
 */

// =============================================================================
// ADMIN ROUTES
// =============================================================================

/**
 * @swagger
 * /forms:
 * post:
 * summary: Create a new Form (Admin)
 * tags: [Forms]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [title, slug]
 * properties:
 * title:
 * type: string
 * slug:
 * type: string
 * description:
 * type: string
 * responses:
 * 201:
 * description: Form created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Form'
 */
formRoute.post(
	'/forms',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(createFormSchema),
	formController.create
);

/**
 * @swagger
 * /forms/{id}/versions:
 * post:
 * summary: Publish a new Version for a Form (Admin)
 * tags: [Forms]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: The UUID of the Form
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * schema:
 * type: object
 * properties:
 * fields:
 * type: array
 * items:
 * type: object
 * properties:
 * key:
 * type: string
 * label:
 * type: string
 * type:
 * type: string
 * enum: [text, number, email, select, checkbox]
 * required:
 * type: boolean
 * responses:
 * 201:
 * description: New version published
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormVersion'
 */
formRoute.post(
	'/forms/:id/versions',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(addVersionSchema),
	formController.addVersion
);

/**
 * @swagger
 * /forms/{formId}/submissions:
 * get:
 * summary: Get all submissions for a Form (Admin)
 * tags: [Submissions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: formId
 * required: true
 * schema:
 * type: string
 * format: uuid
 * responses:
 * 200:
 * description: List of submissions
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Submission'
 */
formRoute.get(
	'/forms/:formId/submissions',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(getSubmissionsSchema),
	submissionController.getAllByForm
);

// =============================================================================
// USER ROUTES
// =============================================================================

/**
 * @swagger
 * /forms/{slug}:
 * get:
 * summary: Get the latest version of a Form (User/Public)
 * tags: [Forms]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: slug
 * required: true
 * schema:
 * type: string
 * description: The URL-friendly slug of the form
 * responses:
 * 200:
 * description: Form details and schema
 * content:
 * application/json:
 * schema:
 * allOf:
 * - $ref: '#/components/schemas/FormVersion'
 * - type: object
 * properties:
 * form:
 * $ref: '#/components/schemas/Form'
 */
formRoute.get('/forms/:slug', authMiddleware, validateRequest(getFormSchema), formController.getOne);

/**
 * @swagger
 * /submissions/{versionId}:
 * post:
 * summary: Submit a response to a specific Form Version
 * tags: [Submissions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: versionId
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: The UUID of the Form Version being submitted to
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [answers]
 * properties:
 * answers:
 * type: object
 * description: Key-value pairs matching the form schema
 * example:
 * full_name: "Dex"
 * age: 25
 * responses:
 * 201:
 * description: Submission received and email queued
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * data:
 * type: object
 * properties:
 * id:
 * type: string
 */
formRoute.post(
	'/submissions/:versionId',
	authMiddleware,
	validateRequest(submitResponseSchema),
	validateDynamicSchema,
	submissionController.submit
);

export { formRoute };
