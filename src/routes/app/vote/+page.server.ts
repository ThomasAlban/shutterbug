import * as db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const voteSchema = z.object({
	ID: z.string().min(1).trim(),
	humour: z.coerce.number().min(0).max(10),
	creativity: z.coerce.number().min(0).max(10),
	photography: z.coerce.number().min(0).max(10)
});

export async function load(event) {
	const previousTheme = await db.getPreviousTheme();
	if (!previousTheme) throw redirect(303, '/app/home');

	const friendsWithSubmissions = await db.getFriendsWithSubmissions(event.locals.user!.userID, previousTheme.themeID);

	return { friendsWithSubmissions, previousTheme };
}

export const actions = {
	async vote(event) {
		const [previousTheme, formData] = await Promise.all([db.getPreviousTheme(), event.request.formData()]);
		if (!previousTheme) throw redirect(303, '/app/home');
		const form = Object.fromEntries(formData);

		let vote: { humour: number; creativity: number; photography: number }, friendID: string;

		try {
			({ ID: friendID, ...vote } = voteSchema.parse(form));
		} catch (e) {
			return fail(400);
		}

		await db.createVote(event.locals.user!.userID, friendID, previousTheme.themeID, vote);
	}
};
