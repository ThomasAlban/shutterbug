import type push from 'web-push';
import * as db from '$lib/server/db';

export async function POST(event) {
	console.log('a');
	if (!event.locals.user) return new Response('no user', { status: 400 });
	console.log('b');
	const body = await event.request.json();
	console.log(body);
	console.log('c');
	const subscription = body as push.PushSubscription;
	console.log(subscription);
	console.log('d');
	if (!subscription) return new Response('could not convert subscription to object', { status: 400 });
	console.log('e');
	await db.setPushSubscription(event.locals.user.userID, subscription);
	console.log('f');

	return new Response('success', { status: 200 });
}
