import { z } from 'zod';

// this schema defines the structure of the email form, it will be used to check if the form the user submits is valid
export const emailSchema = z.object({
	email: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email()
});
