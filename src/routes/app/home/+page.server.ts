import * as db from '$lib/server/db';

export async function load(event) {
	const currentTheme = await db.getCurrentTheme();
	const previousTheme = await db.getPreviousTheme();

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
	else nextTheme = await db.getNextTheme();

	return {
		currentTheme,
		alreadySubmitted,
		nextTheme,
		randomSubmission,
		hasFriends: friends.length > 0,
		submissionsToVoteOn
	};
}
