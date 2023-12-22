import * as jwt from '$lib/server/jwt';
import { redirect } from '@sveltejs/kit';
import { schedule } from 'node-cron';
import * as db from '$lib/server/db';
import { sendNotificationToAll } from '$lib/server/push';

let prevCurrentThemeID: string;
// run this function every hour to check if there is a new theme
schedule('0 */1 * * *', async () => {
	let currentTheme = await db.getCurrentTheme(new Date());
	if (!currentTheme) return;
	if (currentTheme.themeID !== prevCurrentThemeID) {
		sendNotificationToAll({
			title: `New theme: ${currentTheme.theme}`,
			body: "You can now also vote on your friends' submissions from last week!"
		});
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
