import * as db from '$lib/server/db';
import { sendNotification } from '$lib/server/push.js';

export async function GET(event) {
	let user = event.locals.user;
	if (!user) return new Response('no user', { status: 400 });

	let subscription = await db.getPushSubscription(user.userID);

	if (!subscription) return new Response('no sub', { status: 400 });

	sendNotification(subscription, 'hi');

	return new Response('success', { status: 200 });
}
