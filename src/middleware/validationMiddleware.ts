import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HttpError } from './error';

export const validateRequest = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params
		});
		next();
	} catch (error) {
		if (error instanceof ZodError) {
			const message = error.errors.map((e) => e.message).join(', ');
			return next(new HttpError(400, `Validation Error: ${message}`));
		}
		next(error);
	}
};
