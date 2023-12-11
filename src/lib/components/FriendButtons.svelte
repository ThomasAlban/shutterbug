<script lang="ts">
	import type { ClientUser, FriendStatus } from '$lib/server/db';
	import { infoToast } from '$lib/util';
	import FormButton from './FormButton.svelte';

	export let user: ClientUser;
	export let friendStatus: FriendStatus;

	export let type: 'text' | 'icons';

	let invertColor = type == 'text';
</script>

<div class="friend-buttons">
	{#if friendStatus === 'friends'}
		<FormButton
			action="?/remove&id={user.userID}"
			fn={() => infoToast(`${user.username} removed from your friends`)}
			{invertColor}
		>
			{#if type == 'icons'}
				<img src="/icons/cross.png" alt="cross" class="icon" />
			{:else}
				Remove Friend
			{/if}
		</FormButton>
	{:else if friendStatus === 'incomingRequest'}
		<FormButton
			action="?/accept&id={user.userID}"
			fn={() => infoToast(`Friend request from ${user.username} accepted`, 'You are now friends!')}
			{invertColor}
		>
			{#if type == 'icons'}
				<img src="/icons/tick.png" alt="tick" class="icon" />
			{:else}
				Accept Friend Request
			{/if}
		</FormButton>
		<FormButton
			action="?/remove&id={user.userID}"
			fn={() => infoToast(`Friend request from ${user.username} removed`)}
			{invertColor}
		>
			{#if type == 'icons'}
				<img src="/icons/cross.png" alt="cross" class="icon" />
			{:else}
				Remove
			{/if}
		</FormButton>
	{:else if friendStatus === 'outgoingRequest'}
		<FormButton
			action="?/remove&id={user.userID}"
			fn={() => infoToast(`Friend request to ${user.username} cancelled`)}
			{invertColor}
		>
			{#if type == 'icons'}
				<img src="/icons/cross.png" alt="cross" class="icon" />
			{:else}
				Unrequest
			{/if}
		</FormButton>
	{:else if friendStatus === 'none'}
		<FormButton
			action="?/sendRequest&id={user.userID}"
			fn={() => infoToast(`Friend request sent to ${user.username}`)}
			{invertColor}
		>
			{#if type == 'icons'}
				<img src="/icons/plus.png" alt="plus" class="icon" />
			{:else}
				Request
			{/if}
		</FormButton>
	{/if}
</div>

<style>
	.friend-buttons {
		display: flex;
		gap: 0.5rem;
	}
	.icon {
		--size: 1.1em;
		--padding: 0.15em;
		padding: var(--padding) 0 var(--padding) 0;
		width: var(--size);
		height: var(--size);
	}
</style>
