/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import * as sw from '$service-worker';

self.addEventListener('push', () => {
	console.log('push');
	self.registration.showNotification('test', {});
});
