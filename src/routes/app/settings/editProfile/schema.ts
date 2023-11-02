import { z } from 'zod';

export const usernameSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' })
});
export const emailSchema = z.object({
	oldEmail: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	newEmail: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	newEmail2: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' })
});
export const passwordSchema = z.object({
	oldPassword: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
	newPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' }),
	newPassword2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});
