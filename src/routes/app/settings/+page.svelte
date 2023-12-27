<script lang="ts">
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import Button from '$lib/components/Button.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { successToast } from '$lib/util';

	async function allowNotifications() {
		let sw = await navigator.serviceWorker.ready;
		let subscription = await sw.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_VAPID_KEY
		});
		await fetch('/enableNotifs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(subscription)
		});
		successToast('Success', 'You can now receive notifications!');
	}
</script>

<div class="wrapper">
	<div class="orange">
		<h1>Settings</h1>
	</div>
	<div class="links">
		<Button link="/app/settings/editProfile" invertColor={true}>Edit Profile</Button>
		<Button on:click={allowNotifications} invertColor={true}>Enable Notifications</Button>
		<FormButton action="/auth/logout" useEnhance={false} size={1.75} invertColor={true}>Log Out</FormButton>
	</div>
</div>

<style>
	.links {
		padding: 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
