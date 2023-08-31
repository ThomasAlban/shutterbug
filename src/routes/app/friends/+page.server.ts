import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const searchSchema = z.object({
	search: z.string().min(1).trim()
});

export async function load(event) {
	const friendData = await db.getAllFriendData(event.locals.user!.userID);
	const searchForm = await superValidate(event, searchSchema);

	return { searchForm, ...friendData };
}

export const actions = {
	async search(event) {
		const form = await superValidate(event, searchSchema);
		if (!form.valid) return fail(400, { form });

		const searchResult = await db.searchUsersWithFriendStatus(form.data.search, event.locals.user!.userID, 15);

		return { form, searchResult };
	},
	async remove(event) {
		const form = Object.fromEntries(await event.request.formData());
		const friendID = form.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });

		await db.removeFriend(event.locals.user!.userID, friendID);
	},
	async accept(event) {
		const form = Object.fromEntries(await event.request.formData());
		const friendID = form.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });

		await db.acceptFriendRequest(event.locals.user!.userID, friendID);
	},

	async sendRequest(event) {
		const form = Object.fromEntries(await event.request.formData());
		const friendID = form.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });
		if (event.locals.user!.userID === friendID) return fail(400, { message: 'userID and friendID are equal' });

		const friends = await db.getFriends(event.locals.user!.userID);

		for (const friend of friends) {
			if (friend.userID === friendID) return fail(400, { message: 'friend already exists' });
		}

		await db.sendFriendRequest(event.locals.user!.userID, friendID);
	}
};
