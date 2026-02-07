import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { FormVersion } from '../models/form-version.model';
import { BadRequest, ResourceNotFound } from './error';

export const validateDynamicSchema = async (req: Request, res: Response, next: NextFunction) => {
	const { versionId } = req.params;
	const { answers } = req.body;

	const versionRepo = AppDataSource.getRepository(FormVersion);
	const version = await versionRepo.findOne({ where: { id: versionId } });

	if (!version) return next(new ResourceNotFound('Form Version not found'));

	const schema = version.schema;
	const errors: string[] = [];

	for (const field of schema.fields) {
		const userAnswer = answers[field.key];

		if (field.required && (userAnswer === undefined || userAnswer === null || userAnswer === '')) {
			errors.push(`Field '${field.label}' is required`);
		}

		if (userAnswer !== undefined && userAnswer !== null) {
			if (field.type === 'number' && typeof userAnswer !== 'number') {
				errors.push(`Field '${field.label}' must be a number`);
			}
		}
	}

	if (errors.length > 0) {
		return next(new BadRequest(`Validation Failed: ${errors.join(', ')}`));
	}

	next();
};
