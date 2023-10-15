import { z } from 'zod';

export const emailSchema = z.object({
	email: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email()
});
