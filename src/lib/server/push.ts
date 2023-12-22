import push from 'web-push';
import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import * as db from '$lib/server/db';

push.setVapidDetails('mailto:user@me.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function sendNotification(userID: string, data: { title: string; body: string }) {
	let subscription = await db.getPushSubscription(userID);
	if (!subscription) return false;

	await push.sendNotification(subscription, JSON.stringify(data));
	return true;
}

export async function sendNotificationToAll(data: { title: string; body: string }) {
	let subscriptions = await db.getAllPushSubscriptions();

	let sendNotifs = [];
	for (const subscription of subscriptions) {
		sendNotifs.push(push.sendNotification(subscription, JSON.stringify(data)));
	}
	await Promise.all(sendNotifs);

	return true;
}
