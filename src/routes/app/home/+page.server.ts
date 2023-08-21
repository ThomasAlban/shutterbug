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

	const alreadySubmitted = await db.photo.findMany({
		where: { userID: locals.user?.userID, themeID: theme?.themeID }
	});

	return { user: locals.user!, theme, alreadySubmitted: alreadySubmitted.length > 0 };
}
