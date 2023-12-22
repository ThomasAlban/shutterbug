import push from 'web-push';
import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import * as db from '$lib/server/db';

push.setVapidDetails('mailto:user@me.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function sendNotification(userID: string, data: { title: string; body: string }) {
	let subscriptions = await db.getPushSubscriptions(userID);
	if (!subscriptions) return false;

	for (const subscription of subscriptions) {
		try {
			await push.sendNotification(subscription, JSON.stringify(data));
		} catch (e) {
			await db.deletePushSubscription(userID, subscription.endpoint);
		}
	}
	return true;
}

export async function sendNotificationToAll(data: { title: string; body: string }) {
	let subscriptions = await db.getAllPushSubscriptions();

	let sendNotifs = [];
	for (const subscription of subscriptions) {
		let sendNotif = async () => {
			try {
				await push.sendNotification(subscription, JSON.stringify(data));
			} catch (e) {
				await db.deletePushSubscription(subscription.userID, subscription.endpoint);
			}
		};
		sendNotifs.push(sendNotif);
	}
	await Promise.all(sendNotifs);

	return true;
}
