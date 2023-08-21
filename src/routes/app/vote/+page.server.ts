import db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

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
		// include in the query all the user's friends (which have accepted)
		// this is the same as a JOIN statement in SQL
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
			},
			voter: { where: { themeID: theme.themeID } }
		}
	});
	if (!user) throw redirect(303, '/auth/login');

	// make a list of all the user's friends
	let friends: { ID: string; name: string; photo: string | undefined }[] = [];

	// first go through all the friends where the user sent the request
	for (const friend of user.friendRequestsSent) {
		if (friend.requesteeID != user.userID)
			friends.push({ ID: friend.requesteeID, name: friend.requestee.username, photo: undefined });
	}
	// then go through all the friends where the friend sent the request
	for (const friend of user.friendRequestsReceived) {
		if (friend.requesterID != user.userID)
			friends.push({ ID: friend.requesterID, name: friend.requester.username, photo: undefined });
	}

	// iterate through all the user's votes
	for (const vote of user.voter) {
		// if the user has already voted on that friend's submission, remove them from the list of friends
		friends = friends.filter((friend) => {
			return vote.voteeID !== friend.ID;
		});
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

	// make a new array containing only friends who have submitted photos
	// we have to do it explicitly like this as typescript is too stupid if we do it in a nicer way
	const friendsWithPhotos: { ID: string; name: string; photo: string }[] = [];
	for (const friend of friends) {
		if (!friend.photo) continue;
		friendsWithPhotos.push({ ID: friend.ID, name: friend.name, photo: friend.photo });
	}

	return { friendsWithPhotos };
}

export const actions = {
	async vote({ request, locals, url }) {
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

		const formData = Object.fromEntries(await request.formData());
		if (!formData) return fail(400, { message: 'no data' });

		const friendID = url.searchParams.get('friendID');
		if (!friendID) return fail(400, { message: 'no friendID url search param' });

		if (!formData.humour || !formData.creativity || !formData.photography)
			return fail(400, { message: 'form data incorrect' });

		const voteHumour = +formData.humour;
		const voteCreativity = +formData.creativity;
		const votePhotography = +formData.photography;

		try {
			await db.vote.create({
				data: {
					voterID: locals.user!.userID,
					voteeID: friendID,
					themeID: theme.themeID,
					voteHumour,
					voteCreativity,
					votePhotography
				}
			});
		} catch (error) {
			return fail(500, { message: error as string });
		}

		console.log(voteHumour, voteCreativity, votePhotography);
	}
};
