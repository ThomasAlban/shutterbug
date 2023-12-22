import * as db from '$lib/server/db';
import { sendNotification } from '$lib/server/push.js';

export async function GET(event) {
	if (!event.locals.user) return new Response('no user', { status: 400 });

	let subscription = await db.getPushSubscription(event.locals.user.userID);
	if (!subscription) return new Response('no sub', { status: 400 });
	await sendNotification(subscription, 'hi');
	return new Response('success', { status: 200 });
}
