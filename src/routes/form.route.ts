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

// --- ADMIN ROUTES ---
formRoute.post(
	'/forms',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(createFormSchema),
	formController.create
);

formRoute.post(
	'/forms/:id/versions',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(addVersionSchema),
	formController.addVersion
);

formRoute.get(
	'/forms/:formId/submissions',
	authMiddleware,
	checkRole(UserRole.ADMIN),
	validateRequest(getSubmissionsSchema),
	submissionController.getAllByForm
);

// --- USER ROUTES ---
formRoute.get('/forms/:slug', authMiddleware, validateRequest(getFormSchema), formController.getOne);

formRoute.post(
	'/submissions/:versionId',
	authMiddleware,
	validateRequest(submitResponseSchema),
	validateDynamicSchema,
	submissionController.submit
);

export { formRoute };
