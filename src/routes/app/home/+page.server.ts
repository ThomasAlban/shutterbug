import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load(event) {
	const currentDate = new Date();
	const [currentTheme, previousTheme] = await Promise.all([
		db.getCurrentTheme(currentDate),
		db.getPreviousTheme(currentDate)
	]);

	let randomSubmission: string | null = null;
	let friends:
		| {
				user: db.ClientUser;
				photoSubmission: string | null;
				vote: {
					userVote: db.Vote;
					overallVote: db.Vote;
				} | null;
		  }[]
		| db.ClientUser[];

	let submissionsToVoteOn = false;

	if (previousTheme) {
		friends = await db.getFriendsWithSubmissions(event.locals.user!.userID, previousTheme.themeID, true, true);

		randomSubmission = await db.getRandomFriendPhotoSubmission(event.locals.user!.userID, previousTheme, friends);

		// check if there are any photo submissions from the user's friends
		for (const friend of friends) {
			if (friend.photoSubmission && !friend.vote?.userVote) {
				submissionsToVoteOn = true;
				break;
			}
		}
	} else {
		friends = await db.getFriends(event.locals.user!.userID);
	}

	let alreadySubmitted = false;

	let nextTheme: {
		themeID: string;
		theme: string;
		dateStart: Date;
		dateEnd: Date;
	} | null = null;

	// don't bother getting the next theme unless there isn't a current theme
	// because we don't care about the next theme unless there is no current theme
	if (currentTheme)
		alreadySubmitted = await db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID);
	else nextTheme = await db.getNextTheme(currentDate);

	return {
		currentTheme,
		alreadySubmitted,
		nextTheme,
		randomSubmission,
		hasFriends: friends.length > 0,
		submissionsToVoteOn
	};
}

export const actions = {
	async deleteSubmission(event) {
		const themeID = event.url.searchParams.get('themeID');
		if (!themeID) return fail(400);

		await db.deleteSubmission(event.locals.user!.userID, themeID);
	}
};
