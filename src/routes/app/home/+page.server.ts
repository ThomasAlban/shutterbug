import * as db from '$lib/server/db';

export async function load(event) {
	const [currentTheme, previousTheme, nextTheme, randomSubmission, friends] = await Promise.all([
		db.getCurrentTheme(),
		db.getPreviousTheme(),
		db.getNextTheme(),
		db.getRandomFriendPhotoSubmission(event.locals.user!.userID),
		db.getFriends(event.locals.user!.userID)
	]);

	const hasFriends = friends.length > 0;
	let submissionsToVoteOn = false;

	if (hasFriends && previousTheme) {
		const friendSubmissions = await db.getFriendsWithSubmissions(event.locals.user!.userID, previousTheme.themeID);

		// set the submissionsToVoteOn variable to be whether or not there are any friendSubmissions
		submissionsToVoteOn = friendSubmissions.length > 0;
	}

	let alreadySubmitted = false;
	if (currentTheme)
		alreadySubmitted = await db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID);

	return {
		currentTheme,
		alreadySubmitted,
		previousTheme: !!previousTheme,
		nextTheme,
		randomSubmission,
		hasFriends,
		submissionsToVoteOn
	};
}
