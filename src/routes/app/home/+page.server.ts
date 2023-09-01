import * as db from '$lib/server/db';

export async function load(event) {
	const currentTheme = await db.getCurrentTheme();

	let alreadySubmitted = false;
	if (currentTheme)
		alreadySubmitted = await db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID);

	return { user: event.locals.user!, currentTheme, alreadySubmitted };
}
