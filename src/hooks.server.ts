import * as jwt from '$lib/server/jwt';
import { redirect } from '@sveltejs/kit';
import { schedule } from 'node-cron';
import * as db from '$lib/server/db';
import { sendNotification, sendNotificationToAll } from '$lib/server/push';

let prevCurrentThemeID: string;
let sent24HrNotif = false;
// run this function every 20 mins to check if there is a new theme
schedule('*/20 * * * *', async () => {
	console.log('running cronjob fn');
	let currentTheme = await db.getCurrentTheme(new Date());
	if (!currentTheme) return;
	console.log('prev id: ', prevCurrentThemeID, 'current id: ', currentTheme.themeID);

	if (currentTheme.themeID !== prevCurrentThemeID && prevCurrentThemeID != undefined) {
		console.log('sending notif');
		sendNotificationToAll({
			title: `New theme: ${currentTheme.theme}`,
			body: "You can now also vote on your friends' submissions from last week!"
		});
		sent24HrNotif = false;
	}

	let timeDiff = currentTheme.dateEnd.getTime() - currentTheme.dateStart.getTime();
	let hours = Math.floor(timeDiff / 1000 / 60 / 60);

	console.log('hours until theme end: ', hours);

	if (hours == 24 && !sent24HrNotif) {
		console.log('sending 24 hour notifications');
		let [subscriptions, previousTheme] = await Promise.all([
			db.getAllPushSubscriptions(),
			db.getPreviousTheme(new Date())
		]);
		if (!previousTheme) return;

		for (const subscription of subscriptions) {
			let [userSubmittedPhoto, friends] = await Promise.all([
				db.userAlreadySubmittedPhoto(subscription.userID, currentTheme.themeID),
				db.getFriendsWithSubmissions(subscription.userID, previousTheme.themeID, true, true)
			]);

			let submissionsToVoteOn = false;

			// check if there are any photo submissions from the user's friends
			for (const friend of friends) {
				if (friend.photoSubmission && !friend.vote?.userVote) {
					submissionsToVoteOn = true;
					break;
				}
			}

			if (!userSubmittedPhoto && submissionsToVoteOn) {
				sendNotification(subscription.userID, {
					title: 'Only 24 hours left',
					body: "Remember to submit a photo for the current theme, and vote on your friends' submissions from last week!"
				});
			} else if (!userSubmittedPhoto && !submissionsToVoteOn) {
				sendNotification(subscription.userID, {
					title: 'Only 24 hours left',
					body: 'Remember to submit a photo for the current theme!'
				});
			} else if (userSubmittedPhoto && !submissionsToVoteOn) {
				sendNotification(subscription.userID, {
					title: 'Only 24 hours left',
					body: "Remember to vote on your friends' submissions from last week!"
				});
			}
		}
		sent24HrNotif = true;
	}

	prevCurrentThemeID = currentTheme.themeID;
});

// this function is run on every request
export async function handle({ event, resolve }) {
	const user = await jwt.getUserToken(event);
	event.locals.user = user;

	const path = event.url.pathname;

	// routes that non-logged-in users can access
	if ((path.startsWith('/auth') && !path.includes('logout')) || path === '/') {
		if (user) {
			// redirect to either admin home or home
			if (user.admin) throw redirect(303, '/admin/home');
			throw redirect(303, '/app/home');
		}
	}

	//routes that logged-in users can access
	if (path.startsWith('/app')) {
		if (!user) throw redirect(303, '/auth/login');
	}

	// routes that only admins can access
	if (path.startsWith('/admin')) {
		if (!user) throw redirect(303, '/auth/login');
		if (!user.admin) throw redirect(303, '/app/home');
	}

	// do any other stuff that needs to be done on the request
	return await resolve(event);
}
