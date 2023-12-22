import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { searchSchema } from './schema';
import { sendNotification } from '$lib/server/push';

export async function load(event) {
	const [friendData, searchForm] = await Promise.all([
		db.getAllFriendData(event.locals.user!.userID),
		superValidate(event, searchSchema)
	]);

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
		const id = event.url.searchParams.get('id');
		if (!id) return fail(400);

		await db.removeFriend(event.locals.user!.userID, id);
	},
	async accept(event) {
		const id = event.url.searchParams.get('id');
		if (!id) return fail(400);

		await db.acceptFriendRequest(event.locals.user!.userID, id);
	},

	async sendRequest(event) {
		const [friends, reports] = await Promise.all([db.getFriends(event.locals.user!.userID), db.getAllReports()]);

		const id = event.url.searchParams.get('id');
		if (!id) return fail(400);

		if (event.locals.user!.userID === id) return fail(400);

		for (const report of reports) {
			if (report.reporterID === id && report.culpritID === event.locals.user!.userID) return fail(400);
		}

		for (const friend of friends) {
			if (friend.userID === id) return fail(400);
		}

		await db.sendFriendRequest(event.locals.user!.userID, id);

		await sendNotification(id, {
			title: `Friend request from ${event.locals.user!.username}`,
			body: `Accept ${event.locals.user!.username}'s friend request!`
		});
	}
};
