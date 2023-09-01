import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';

const deleteReportSchema = z.object({
	reporterID: z.string().min(1).trim(),
	culpritID: z.string().min(1).trim()
});
const createThemeSchema = z.object({
	theme: z.string({ required_error: 'Theme is required' }).min(1, { message: 'Theme is required' }).trim(),
	dateStart: z.date().min(new Date(), { message: 'Date Start must be in the future' }),
	dateEnd: z.date().min(new Date(), { message: 'Date End must be in the future' })
});

export async function load(event) {
	const [reports, themes, createThemeForm] = await Promise.all([
		db.getAllReports(),
		db.getAllThemes(),
		superValidate(event, createThemeSchema)
	]);

	return { reports, themes, createThemeForm };
}

export const actions = {
	// this runs when the delete button for a report is clicked
	async deleteReport(event) {
		const form = Object.fromEntries(await event.request.formData());

		let reporterID: string, culpritID: string;
		try {
			({ reporterID, culpritID } = deleteReportSchema.parse(form));
		} catch (e) {
			return fail(400);
		}
		await db.deleteReport(reporterID, culpritID);
	},
	async createTheme(event) {
		const form = await superValidate(event, createThemeSchema);
		if (!form.valid) return fail(400, { form });

		// validate the date input
		if (form.data.dateStart >= form.data.dateEnd)
			return setError(form, 'dateStart', 'Date Start is later than Date End');

		// check if the dates of the submitted theme overlap with any other themes
		const themes = await db.getAllThemes();
		for (const theme of themes) {
			if (theme.dateStart <= form.data.dateEnd && theme.dateEnd >= form.data.dateStart)
				return setError(form, 'dateStart', 'Dates overlap with a current theme');
		}

		await db.createTheme(form.data.theme, form.data.dateStart, form.data.dateEnd);

		return { form };
	}
};
