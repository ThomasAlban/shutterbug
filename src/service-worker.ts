/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (e) => {
	const payload = e.data?.text() ?? '';
	sw.registration.showNotification('Shutterbug', {
		icon: 'icon192.png',
		body: payload,
		vibrate: [200, 200, 100, 100, 100, 100, 200, 200, 200, 200]
	});
});
