import push from 'web-push';
import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';

push.setVapidDetails('mailto:user@me.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function sendNotification(subscription: push.PushSubscription, data: { title: string; body: string }) {
	await push.sendNotification(subscription, JSON.stringify(data));
}
