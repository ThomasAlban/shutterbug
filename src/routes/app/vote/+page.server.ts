import db from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	// get the current theme
	const currentDate = new Date();
	const theme = await db.theme.findFirst({
		where: {
			dateStart: {
				lt: currentDate
			},
			dateEnd: {
				gt: currentDate
			}
		}
	});
	if (!theme) throw redirect(303, '/app/home');

	// get the currently logged-in user, and also find all their friends
	const user = await db.user.findUnique({
		where: {
			userID: locals.user?.userID
		},
		include: {
			friendRequestsSent: {
				where: {
					accepted: true
				},
				include: {
					requestee: true
				}
			},
			friendRequestsReceived: {
				where: {
					accepted: true
				},
				include: {
					requester: true
				}
			}
		}
	});
	if (!user) throw redirect(303, '/auth/login');

	// make a list of all the user's friends
	const friends: { ID: string; name: string; photo: string | undefined }[] = [];

	// first go through all the friends where the user sent the request
	for (const friend of user.friendRequestsSent) {
		if (friend.requesteeID != user.userID)
			friends.push({
				ID: friend.requesteeID,
				name: friend.requestee.username,
				photo: undefined
			});
	}
	// then go through all the friends where the friend sent the request
	for (const friend of user.friendRequestsReceived) {
		if (friend.requesterID != user.userID)
			friends.push({ ID: friend.requesterID, name: friend.requester.username, photo: undefined });
	}
	// get all the friends' photo submissions and add them if they exist
	for (const friend of friends) {
		const photo = await db.photo.findUnique({
			where: {
				userID_themeID: {
					userID: friend.ID,
					themeID: theme.themeID
				},
				themeID: theme.themeID
			}
		});
		friend.photo = photo?.photo;
	}

	// console.log(friends);
	return { friends };
}
