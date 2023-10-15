import * as db from '$lib/server/db';

export async function load(event) {
	const [currentTheme, previousTheme, nextTheme, randomSubmission] = await Promise.all([
		db.getCurrentTheme(),
		db.getPreviousTheme(),
		db.getNextTheme(),
		db.getRandomFriendPhotoSubmission(event.locals.user!.userID)
	]);
	let alreadySubmitted = false;
	if (currentTheme)
		alreadySubmitted = await db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID);

	return {
		user: event.locals.user!,
		currentTheme,
		alreadySubmitted,
		previousTheme: !!previousTheme,
		nextTheme,
		randomSubmission
	};
}
