import * as db from '$lib/server/db';
import { sendNotificationToAll } from '$lib/server/push';

// this should be run once every 24 hours at 12:15 pm
async function GET() {
	console.log('running cronjob');
	let now = new Date();
	console.log(now);
	let currentTheme = await db.getCurrentTheme(now);
	if (!currentTheme) return;

	console.log('there is a current theme');

	let hoursAfterStart = (now.getTime() - currentTheme.dateStart.getTime()) / 1000 / 60 / 60;
	console.log(hoursAfterStart);

	if (hoursAfterStart < 24) {
		console.log('sending new theme notif');
		// sendNotificationToAll({
		// 	title: `New theme: ${currentTheme.theme}`,
		// 	body: "You can now also vote on your friends' submissions from last week!"
		// });
		return;
	}

	let hoursBeforeEnd = (currentTheme.dateEnd.getTime() - now.getTime()) / 1000 / 60 / 60;
	console.log(hoursBeforeEnd);

	if (hoursBeforeEnd < 24) {
		console.log('sending 24 hr notif');
		// sendNotificationToAll({
		// 	title: 'Less than 24 hours left',
		// 	body: "Remember to submit a photo and vote if you haven't already!"
		// });
	}
}
