import { error, fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { z } from 'zod';

const deleteReportSchema = z.object({
	reporterID: z.string().min(1).trim(),
	culpritID: z.string().min(1).trim()
});

export async function load(event) {
	const user = await db.adminGetUserWithReports(event.params.userID);
	if (!user) throw error(404, { message: 'User not found' });
	return { user };
}

export const actions = {
	// runs when the toggle admin button is pressed
	async toggleAdmin(event) {
		await db.userAdminToggle(event.params.userID);
	},
	// runs when the delete report button is pressed
	async deleteReport(event) {
		const form = Object.fromEntries(await event.request.formData());
		let reporterID: string, culpritID: string;
		try {
			({ reporterID, culpritID } = deleteReportSchema.parse(form));
		} catch (e) {
			return fail(400, { message: 'validation error: ' + (e as string) });
		}
		await db.deleteReport(reporterID, culpritID);
	},
	// runs when the delete user button is pressed
	async deleteUser({ params }) {
		await db.deleteUser(params.userID);
		// redirect them because the user no longer exists
		throw redirect(303, '/admin/home');
	}
};
