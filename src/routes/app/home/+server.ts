import type push from 'web-push';
import * as db from '$lib/server/db';

export async function POST(event) {
	if (!event.locals.user) return new Response('no user', { status: 400 });

	const body = await event.request.json();
	const subscription = body as push.PushSubscription;

	if (!subscription) return new Response('could not convert subscription to object', { status: 400 });

	await db.setPushSubscription(event.locals.user.userID, subscription);

	return new Response('success', { status: 200 });
}
