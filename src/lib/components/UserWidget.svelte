<script lang="ts">
	import type { ClientUser, FriendStatus } from '$lib/server/db';
	import ProfilePicture from './ProfilePicture.svelte';
	import FormButton from './FormButton.svelte';
	import { toasts } from 'svelte-toasts';

	export let user: ClientUser;

	export let friendStatus: FriendStatus;

	if (user.profilePhoto) {
		// add cloudinary url params
		let urlArr = user.profilePhoto.split('/');
		let uploadIx = urlArr.findIndex((e) => e === 'upload');
		urlArr.splice(uploadIx + 1, 0, 'w_75,q_auto:good,f_auto');
		user.profilePhoto = urlArr.join('/');
	}
	function toast(title: string, description: string = '') {
		toasts.info({
			title,
			description
		});
	}
</script>

<div class="user-widget">
	<div class="content">
		<ProfilePicture src={user.profilePhoto} size={1.5} />
		<a href="/app/user/{user.userID}">
			{user.username}
		</a>
		{#if friendStatus === 'friends'}
			<img src="/icons/users.png" alt="friends-icon" class="friends-icon" />
			<FormButton
				action="?/remove&id={user.userID}"
				fn={() => {
					toast(`${user.username} removed from your friends`);
				}}
			>
				Remove
			</FormButton>
		{:else if friendStatus === 'incomingRequest'}
			<FormButton
				action="?/accept&id={user.userID}"
				fn={() => toast(`Friend request from ${user.username} accepted`, 'You are now friends!')}
			>
				Accept
			</FormButton>
			<FormButton
				action="?/remove&id={user.userID}"
				fn={() => {
					toast(`Friend request from ${user.username} removed`);
				}}
			>
				Remove
			</FormButton>
		{:else if friendStatus === 'outgoingRequest'}
			<FormButton action="?/remove&id={user.userID}" fn={() => toast(`Friend request to ${user.username} cancelled`)}>
				Unrequest
			</FormButton>
		{:else if friendStatus === 'none'}
			<FormButton action="?/sendRequest&id={user.userID}" fn={() => toast(`Friend request sent to ${user.username}`)}>
				Request
			</FormButton>
		{/if}
	</div>
</div>

<style>
	a {
		color: inherit;
		text-decoration: none;
	}
	.content {
		display: flex;
		--gap: 1;
		gap: min(calc(var(--gap) * 1rem), calc(var(--gap) * var(--rem-vw-ratio) * 1vw));

		justify-content: center;
		align-items: center;
	}
	.user-widget {
		--background-color: #fff;
		--text-color: var(--orange);

		--size: 2;
		--line-height: 2.5;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));

		text-decoration: none;
		font-family: 'Merriweather-BoldItalic';
		display: inline-block;

		color: var(--orange);

		border-radius: 500px;

		transition-property: width;

		border: 1px solid transparent;
		letter-spacing: 0.05rem;
		text-align: center;

		color: var(--text-color);
		background-color: var(--background-color);

		box-shadow: 0 calc(var(--size) * 0.2rem) calc(var(--size) * 0.3rem) 1px rgb(50, 50, 50);

		--p-hor-val: 1;
		--p-vert-val: 0.2;
		--p-hor: min(calc(var(--p-hor-val) * 1rem), calc(var(--p-hor-val) * var(--rem-vw-ratio) * 1vw));
		--p-vert: min(calc(var(--p-vert-val) * 1rem), calc(var(--p-vert-val) * var(--rem-vw-ratio) * 1vw));

		padding: var(--p-vert) var(--p-hor) var(--p-vert) var(--p-hor);
	}
	.friends-icon {
		height: 1em;
		/* https://codepen.io/sosuke/pen/Pjoqqp */
		/* used this website to generate a set of filters that will make the color of the icon be the exact orange we want */
		filter: invert(52%) sepia(76%) saturate(2892%) hue-rotate(10deg) brightness(98%) contrast(102%);
	}
</style>
