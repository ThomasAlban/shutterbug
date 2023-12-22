import { sendNotification } from '$lib/server/push.js';

export async function GET(event) {
	if (!event.locals.user) return new Response('no user', { status: 400 });

	await sendNotification(event.locals.user.userID, { title: 'Test Notification', body: 'this is the body' });

	return new Response('success', { status: 200 });
}
