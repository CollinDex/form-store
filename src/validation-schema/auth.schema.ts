import { z } from 'zod';
import { UserRole } from '../types';

const signUpSchema = z.object({
	body: z.object({
		username: z.string().min(1, { message: 'Username cannot be empty' }),
		email: z.string().min(1, { message: 'Email cannot be empty' }).email({ message: 'Input a valid email' }),
		role: z.nativeEnum(UserRole).optional(),
		password: z.string().min(1, { message: 'Password cannot be empty' })
	})
});

const signInSchema = z.object({
	body: z.object({
		email: z.string().min(1, { message: 'Email cannot be empty' }).email({ message: 'Input a valid email' }),
		password: z.string().min(1, { message: 'Password cannot be empty' })
	})
});

export { signUpSchema, signInSchema };
