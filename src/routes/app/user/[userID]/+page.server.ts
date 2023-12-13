import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load(event) {
	const currentTheme = await db.getCurrentTheme(new Date());
	let userData: db.ClientUserFriendDataAndPhotos;
	if (currentTheme) {
		userData = await db.getClientUserFriendDataAndPhotos(event.params.userID, event.locals.user!.userID, {
			themeID: currentTheme.themeID
		});
	} else {
		userData = await db.getClientUserFriendDataAndPhotos(event.params.userID, event.locals.user!.userID);
	}
	return { userData };
}

export const actions = {
	async remove(event) {
		await db.removeFriend(event.locals.user!.userID, event.params.userID);
	},
	async accept(event) {
		await db.acceptFriendRequest(event.locals.user!.userID, event.params.userID);
	},
	async sendRequest(event) {
		if (event.locals.user!.userID === event.params.userID)
			return fail(400, { message: 'userID and friendID are equal' });

		const [friends, reports] = await Promise.all([db.getFriends(event.locals.user!.userID), db.getAllReports()]);

		for (const friend of friends) {
			if (friend.userID === event.params.userID) return fail(400, { message: 'friend already exists' });
		}

		for (const report of reports) {
			if (report.reporterID === event.params.userID && report.culpritID === event.locals.user!.userID)
				return fail(400, { message: 'cannot send friend request, you have been reported by this user' });
		}

		await db.sendFriendRequest(event.locals.user!.userID, event.params.userID);
	},
	async report(event) {
		if (event.locals.user!.userID === event.params.userID)
			return fail(400, { message: 'reporterID and culpritID are equal' });
		// await the formData and check already reported at the same time
		const [formData, checkAlreadyReported] = await Promise.all([
			event.request.formData(),
			db.checkReported(event.locals.user!.userID, event.params.userID)
		]);

		const form = Object.fromEntries(formData);
		if (checkAlreadyReported) return fail(400, { message: 'already reported user' });

		const reason = form.reason ? form.reason.toString() : undefined;

		const [, notFriends] = await Promise.all([
			db.createReport(event.locals.user!.userID, event.params.userID, reason),
			db.isNotFriendsWith(event.locals.user!.userID, event.params.userID)
		]);
		// if they are not friends then just return
		if (notFriends) return;

		// if they are friends then remove friend
		await db.removeFriend(event.locals.user!.userID, event.params.userID);
	},
	async deleteReport(event) {
		if (event.locals.user!.userID === event.params.userID)
			return fail(400, { message: 'reporterID and culpritID are equal' });

		const checkAlreadyReported = await db.checkReported(event.locals.user!.userID, event.params.userID);
		if (!checkAlreadyReported) return fail(400, { message: 'there is no report to delete' });

		await db.deleteReport(event.locals.user!.userID, event.params.userID);
	}
};
