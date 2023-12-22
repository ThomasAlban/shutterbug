/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

// declare let self: ServiceWorkerGlobalScope;

const sw = self as unknown as ServiceWorkerGlobalScope;

// import * as sw from '$service-worker';

sw.addEventListener('push', () => {
	console.log('push');
	sw.registration.showNotification('test', {});
});
