import { z } from 'zod';

export const deleteReportSchema = z.object({
	reporterID: z.string().min(1).trim(),
	culpritID: z.string().min(1).trim()
});
export const createThemeSchema = z.object({
	theme: z.string({ required_error: 'Theme is required' }).min(1, { message: 'Theme is required' }).trim(),
	dateStart: z.coerce.date(),
	dateEnd: z.coerce.date().min(new Date(), { message: 'Date End must be in the future' })
});
export const sendNotifSchema = z.object({
	userID: z.string().optional(),
	title: z.string(),
	body: z.string()
});
