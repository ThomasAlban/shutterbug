import { z } from 'zod';

export const usernameSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim()
});

export const passwordSchema = z.object({
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' }),
	password2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});
