import * as db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const voteSchema = z.object({
	userID: z.string().min(1).trim(),
	humour: z.coerce.number().min(0).max(100),
	creativity: z.coerce.number().min(0).max(100),
	photography: z.coerce.number().min(0).max(100)
});
const votesSchema = z.array(voteSchema);

export async function load(event) {
	const previousTheme = await db.getPreviousTheme();
	if (!previousTheme) throw redirect(303, '/app/home');

	const friends = await db.getFriendsWithSubmissions(event.locals.user!.userID, previousTheme.themeID);

	let friendsWithSubmissions: {
		user: db.ClientUser;
		photoSubmission: string;
		vote: {
			userVote: db.Vote;
			overallVote: db.Vote;
		} | null;
	}[] = [];
	for (const friend of friends) {
		if (friend.photoSubmission && !friend.vote?.userVote)
			friendsWithSubmissions.push({
				user: friend.user,
				photoSubmission: friend.photoSubmission,
				vote: friend.vote
			});
	}

	return { friendsWithSubmissions, previousTheme };
}

export const actions = {
	async vote(event) {
		const votesString = event.url.searchParams.get('votes');
		if (votesString === null) return fail(400, { message: 'no votes url param' });
		const votes = JSON.parse(votesString);

		let votesParsed;
		try {
			votesParsed = votesSchema.parse(votes);
		} catch (_) {
			return fail(400, { message: 'unable to parse votes' });
		}
		console.log(votes);

		const previousTheme = await db.getPreviousTheme();
		if (!previousTheme) return fail(400, { message: 'no previous theme' });

		for (const vote of votesParsed) {
			await db.createVote(event.locals.user!.userID, vote.userID, previousTheme.themeID, vote);
		}
		return { voteSuccess: true };
	}
};
