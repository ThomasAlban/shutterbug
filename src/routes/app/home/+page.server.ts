import db from '$lib/server/db';

export async function load({ locals }) {
	const currentDate = new Date();
	const theme = await db.theme.findFirst({
		where: {
			dateStart: {
				lt: currentDate
			},
			dateEnd: {
				gt: currentDate
			}
		}
	});

	return { user: locals.user!, theme };
}
