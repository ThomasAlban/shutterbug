import { z } from 'zod';

export const registerSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	email: z.string({ required_error: 'Email is required', invalid_type_error: 'Invalid email' }).email(),
	email2: z.string({ required_error: 'Email is required', invalid_type_error: 'Invalid email' }).email(),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' }),
	password2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});
