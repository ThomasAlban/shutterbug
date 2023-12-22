/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (e) => {
	const payload = e.data?.text() ?? '';

	let title = 'Shutterbug';
	let body = '';

	try {
		({ title, body } = JSON.parse(payload));
	} catch {}

	sw.registration.showNotification(title, {
		icon: 'icon192.png',
		body
	});
});
