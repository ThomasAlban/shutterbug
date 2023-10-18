import { z } from 'zod';

export const searchSchema = z.object({
	search: z.string().min(1).trim()
});

export const removeSchema = z.object({
	ID: z.string().min(1)
});

export const acceptSchema = z.object({
	ID: z.string().min(1)
});

export const sendRequestSchema = z.object({
	ID: z.string().min(1)
});
