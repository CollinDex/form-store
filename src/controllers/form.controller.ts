import { Request, Response, NextFunction } from 'express';
import { FormService } from '../services/form.service';
import { FormSchema } from '../types/form.types';
import { HttpError } from '../middleware';
import { sendJsonResponse } from '../utils/send-response';

export class FormController {
	private formService: FormService;

	constructor() {
		this.formService = new FormService();
	}

	// POST /forms
	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { title, slug, description } = req.body;
			const form = await this.formService.createForm(title, slug, description);
			sendJsonResponse(res, 201, 'Form created successfully', form);
		} catch (error: any) {
			if (error instanceof HttpError) {
				return next(error);
			}
			return next(new HttpError(error.status || 500, error.message || error));
		}
	};

	// POST /forms/:id/versions
	addVersion = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const schema: FormSchema = req.body.schema; // Expecting { fields: [] }

			const version = await this.formService.addVersion(id, schema);
			sendJsonResponse(res, 201, 'New version published', version);
		} catch (error: any) {
			if (error instanceof HttpError) {
				return next(error);
			}
			return next(new HttpError(error.status || 500, error.message || error));
		}
	};

	// GET /forms/:slug (Public endpoint to render the form)
	getOne = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { slug } = req.params;
			const form = await this.formService.getLatestVersion(slug);
			sendJsonResponse(res, 200, null, form);
		} catch (error: any) {
			if (error instanceof HttpError) {
				return next(error);
			}
			return next(new HttpError(error.status || 500, error.message || error));
		}
	};
}
