import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { searchSchema, acceptSchema, removeSchema, sendRequestSchema } from './schema';

export async function load(event) {
	const [friendData, searchForm, acceptForm, removeForm, sendRequestForm] = await Promise.all([
		db.getAllFriendData(event.locals.user!.userID),
		superValidate(event, searchSchema),
		superValidate(event, acceptSchema),
		superValidate(event, removeSchema),
		superValidate(event, sendRequestSchema)
	]);

	return { searchForm, acceptForm, removeForm, sendRequestForm, ...friendData };
}

export const actions = {
	async search(event) {
		const form = await superValidate(event, searchSchema);
		if (!form.valid) return fail(400, { form });

		const searchResult = await db.searchUsersWithFriendStatus(form.data.search, event.locals.user!.userID, 15);

		return { form, searchResult };
	},
	async remove(event) {
		const form = await superValidate(event, removeSchema);
		if (!form.valid) return fail(400, { form });

		await db.removeFriend(event.locals.user!.userID, form.data.ID);
	},
	async accept(event) {
		const form = await superValidate(event, acceptSchema);
		if (!form.valid) return fail(400, { form });

		await db.acceptFriendRequest(event.locals.user!.userID, form.data.ID);
	},

	async sendRequest(event) {
		const [form, friends, reports] = await Promise.all([
			superValidate(event, sendRequestSchema),
			db.getFriends(event.locals.user!.userID),
			db.getAllReports()
		]);

		if (!form.valid) return fail(400, { form });

		if (event.locals.user!.userID === form.data.ID) return setError(form, 'ID', 'userID and friendID are equal');

		for (const report of reports) {
			if (report.reporterID === form.data.ID && report.culpritID === event.locals.user!.userID)
				return setError(form, 'ID', 'cannot send friend request, you have been reported by this user');
		}

		for (const friend of friends) {
			if (friend.userID === form.data.ID) return setError(form, 'ID', 'friend already exists');
		}

		await db.sendFriendRequest(event.locals.user!.userID, form.data.ID);
	}
};
