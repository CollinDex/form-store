import { z } from 'zod';

const FieldTypeEnum = z.enum(['text', 'number', 'email', 'select', 'checkbox']);

const formFieldSchema = z.object({
	key: z.string().min(1, { message: "Field key is required (e.g., 'full_name')" }),
	label: z.string().min(1, { message: "Field label is required (e.g., 'Full Name')" }),
	type: FieldTypeEnum,
	required: z.boolean(),
	options: z.array(z.string()).optional()
});

const createFormSchema = z.object({
	body: z.object({
		title: z.string().min(1, { message: 'Title cannot be empty' }),
		slug: z
			.string()
			.min(1, { message: 'Slug cannot be empty' })
			.regex(/^[a-z0-9-]+$/, { message: 'Slug must be URL-friendly (lowercase, numbers, hyphens only)' }),
		description: z.string().optional()
	})
});

const addVersionSchema = z.object({
	params: z.object({
		id: z.string().uuid({ message: 'Invalid Form ID' })
	}),
	body: z.object({
		schema: z.object({
			fields: z.array(formFieldSchema).min(1, { message: 'Form must have at least one field' })
		})
	})
});

const submitResponseSchema = z.object({
	params: z.object({
		versionId: z.string().uuid({ message: 'Invalid Version ID' })
	}),
	body: z.object({
		answers: z.record(z.any(), { message: 'Answers must be a JSON object' })
	})
});

const getFormSchema = z.object({
	params: z.object({
		slug: z.string().min(1, { message: 'Slug is required' })
	})
});

const getSubmissionsSchema = z.object({
	params: z.object({
		formId: z.string().uuid({ message: 'Invalid Form ID' })
	})
});

export { createFormSchema, addVersionSchema, submitResponseSchema, getFormSchema, getSubmissionsSchema };
