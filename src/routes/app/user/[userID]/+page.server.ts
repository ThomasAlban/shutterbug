import * as db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';

export async function load(event) {
	const userData = await db.getClientUserFriendDataAndPhotos(event.params.userID, event.locals.user!.userID);
	if (!userData) throw error(404, { message: 'User not found' });
	return { userData };
}

export const actions = {
	async remove(event) {
		const formData = Object.fromEntries(await event.request.formData());
		const friendID = formData.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });

		await db.removeFriend(event.locals.user!.userID, friendID);
	},
	async accept(event) {
		const formData = Object.fromEntries(await event.request.formData());
		const friendID = formData.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });

		await db.acceptFriendRequest(event.locals.user!.userID, friendID);
	},
	async sendRequest(event) {
		const formData = Object.fromEntries(await event.request.formData());
		const friendID = formData.ID.toString();
		if (!friendID) return fail(400, { message: 'no ID supplied' });
		if (event.locals.user!.userID === friendID) return fail(400, { message: 'userID and friendID are equal' });

		const friends = await db.getFriends(event.locals.user!.userID);

		for (const friend of friends) {
			if (friend.userID === friendID) return fail(400, { message: 'friend already exists' });
		}

		await db.sendFriendRequest(event.locals.user!.userID, friendID);
	}
};
