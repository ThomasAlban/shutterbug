<script lang="ts">
	import type { ClientUser, FriendStatus } from '$lib/server/db';
	import ProfilePicture from './ProfilePicture.svelte';

	export let user: ClientUser;

	if (user.profilePhoto == null) {
		user.profilePhoto = '';
	} else {
		let urlArr = user.profilePhoto.split('/');
		let uploadIx = urlArr.findIndex((e) => e === 'upload');
		urlArr.splice(uploadIx + 1, 0, 'w_75,q_auto:good,f_auto');
		user.profilePhoto = urlArr.join('/');
	}

	export let friendStatus: FriendStatus;
</script>

<a href="/app/user/{user.userID}">
	<div class="content">
		<ProfilePicture src={user.profilePhoto ?? ''} size={1.5} />
		{user.username}
	</div>
</a>

<style>
	.content {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}
	a {
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

		padding: 0.2rem 1rem 0.2rem 1rem;
	}
</style>
