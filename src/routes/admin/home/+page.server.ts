import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { deleteReportSchema, createThemeSchema, sendNotifSchema } from './schema';
import { sendNotification, sendNotificationToAll } from '$lib/server/push';

export async function load(event) {
	const [reports, themes, createThemeForm, deleteReportForm, sendNotifForm] = await Promise.all([
		db.getAllReports(),
		db.getAllThemes(),
		superValidate(event, createThemeSchema),
		superValidate(event, deleteReportSchema),
		superValidate(event, sendNotifSchema)
	]);

	return { reports, themes, createThemeForm, deleteReportForm, sendNotifForm };
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
	},
	async sendNotif(event) {
		const form = await superValidate(event, sendNotifSchema);
		if (!form.valid) return fail(400, { form });

		let data = { title: form.data.title, body: form.data.body };

		let result;
		if (form.data.userID) {
			let userExists = await db.getClientUser(form.data.userID);
			if (!userExists) return setError(form, 'userID', 'User does not exist');
			console.log('sending');
			result = await sendNotification(form.data.userID, data);
		} else {
			result = await sendNotificationToAll(data);
		}
		return { form, result };
	}
};
