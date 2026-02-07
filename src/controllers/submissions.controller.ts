import { Request, Response, NextFunction } from 'express';
import { SubmissionService } from '../services/submission.service';
import { HttpError } from '../middleware';
import { sendJsonResponse } from '../utils/send-response';

export class SubmissionController {
	private submissionService: SubmissionService;

	constructor() {
		this.submissionService = new SubmissionService();
	}

	// POST /submissions/:versionId
	submit = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { versionId } = req.params;
			const { answers } = req.body;

			const userEmail = req.user.email;

			const submission = await this.submissionService.submitResponse(versionId, answers, userEmail);
			sendJsonResponse(res, 201, 'Submission received successfully', { id: submission.id });
		} catch (error: any) {
			if (error instanceof HttpError) {
				return next(error);
			}
			return next(new HttpError(error.status || 500, error.message || error));
		}
	};

	// GET /forms/:formId/submissions (Admin View)
	getAllByForm = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { formId } = req.params;
			const submissions = await this.submissionService.getSubmissions(formId);
			sendJsonResponse(res, 200, null, submissions);
		} catch (error: any) {
			if (error instanceof HttpError) {
				return next(error);
			}
			return next(new HttpError(error.status || 500, error.message || error));
		}
	};
}
