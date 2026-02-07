export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox';

export interface FormField {
	key: string;
	label: string;
	type: FieldType;
	required: boolean;
	options?: string[];
}

export interface FormSchema {
	fields: FormField[];
}

export interface SubmissionAnswers {
	[key: string]: string | number | boolean;
}
