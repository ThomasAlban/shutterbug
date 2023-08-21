import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load() {
	return {
		// get all reports
		reports: await db.report.findMany(),
		// get all themes
		themes: await db.theme.findMany()
	};
}

export const actions = {
	// this runs when the delete button for a report is clicked
	async deleteReport({ url }) {
		const reporterID = url.searchParams.get('reporterID');
		const culpritID = url.searchParams.get('culpritID');

		if (!reporterID || !culpritID) return fail(400);

		try {
			await db.report.delete({
				where: {
					reporterID_culpritID: {
						reporterID,
						culpritID
					}
				}
			});
		} catch (error) {
			return fail(500, { error });
		}
		return { status: 200 };
	},
	async createTheme({ request }) {
		const formData = Object.fromEntries(await request.formData());
		if (!formData.theme || !formData.dateStart || !formData.dateEnd) return fail(400);

		const theme = formData.theme.toString();
		const dateStart = new Date(formData.dateStart.toString());
		const dateEnd = new Date(formData.dateEnd.toString());

		// validate the date input
		if (dateStart >= dateEnd) return fail(400);

		try {
			await db.theme.create({
				data: {
					theme,
					dateStart,
					dateEnd
				}
			});
		} catch (error) {
			return fail(500, { error });
		}
		return { status: 200 };
	}
};
