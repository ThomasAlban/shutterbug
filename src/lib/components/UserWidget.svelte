<script lang="ts">
	import type { ClientUser, FriendStatus } from '$lib/server/db';
	import ProfilePicture from './ProfilePicture.svelte';
	import { onMount } from 'svelte';
	import FriendButtons from './FriendButtons.svelte';
	import { vw2px } from '$lib/util';

	export let user: ClientUser;
	export let friendStatus: FriendStatus;
	export let showButtons = true;
	export let size = 2;
	export let maxWidthRem = 40;
	export let maxWidthVW = 90;

	let content: HTMLDivElement;
	let contentWidth: number;
	let a: HTMLAnchorElement;
	let windowWidth: number;
	let widget: HTMLDivElement;

	// how many rem we want to subtract from the font size
	let fontSub = 0;

	onMount(updateWidth);
	$: content?.scrollWidth, contentWidth, updateWidth();

	function updateWidth() {
		if (!content || !a || !widget) return;
		// get the maximum width of the widget in pixels
		let maxWidth = parseInt(getComputedStyle(widget).maxWidth);
		// if the max with in vw they specified is smaller, use that instead as the max width
		const maxWidthVWinPX = vw2px(maxWidthVW, windowWidth);
		if (maxWidthVWinPX < maxWidth) maxWidth = maxWidthVWinPX;

		// if the content is overflowing or bigger then the maximum width
		if (content.scrollWidth > contentWidth || content.scrollWidth >= maxWidth) {
			// run the function again after the DOM updates
			setTimeout(updateWidth, 1);
			// make the font a little smaller
			fontSub += 0.1;
		}

		const errorBound = 30;
		// if the font size could be bigger than it currently is, and still remain within the maximum width specified (and the font is smaller than normal)
		if (maxWidth - contentWidth > errorBound && fontSub > 0) {
			// run the function again after the DOM updates
			setTimeout(updateWidth, 1);
			// make the font a litle bigger
			fontSub -= 0.1;
		}
	}
</script>

<!-- get the outer width of the window -->
<svelte:window bind:outerWidth={windowWidth} />

<div
	class="user-widget"
	bind:this={widget}
	style="--size: {size}; --max-width: min({maxWidthRem}rem, calc({maxWidthRem} * var(--rem-vw-ratio) * 1vw)); --font-sub: {fontSub}rem;"
>
	<div class="content" bind:this={content} bind:clientWidth={contentWidth}>
		<ProfilePicture src={user.profilePhoto} size={1.5} />
		<a href="/app/user/{user.userID}" bind:this={a}>
			{user.username}
		</a>
		{#if friendStatus === 'friends'}
			<img src="/icons/users.png" alt="friends-icon" class="friends-icon" />
		{/if}
		{#if showButtons}
			<FriendButtons {user} {friendStatus} type="icons" />
		{/if}
	</div>
</div>

<style>
	a {
		color: inherit;
		text-decoration: none;
		/* calculate the font size based on the size prop, and how much needs to be subtracted (from the updateWidth function) */
		font-size: calc(min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw)) - var(--font-sub));
	}
	.content {
		display: flex;
		--gap: 1;
		gap: min(calc(var(--gap) * 1rem), calc(var(--gap) * var(--rem-vw-ratio) * 1vw));

		justify-content: space-between;
		align-items: center;
	}
	.user-widget {
		overflow: hidden;
		--background-color: #fff;
		--text-color: var(--orange);

		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--size) * 1.4 * 1rem), calc(var(--size) * 1.4 * var(--rem-vw-ratio) * 1vw));

		/* make sure the user widget does not go above the max width prop */
		max-width: var(--max-width);

		font-family: 'Merriweather-BoldItalic';
		display: inline-block;

		color: var(--orange);

		/* make corners rounded */
		border-radius: 500px;

		border: 1px solid transparent;
		letter-spacing: 0.05rem;
		text-align: center;

		color: var(--text-color);
		background-color: var(--background-color);

		/* calculare the box shadow based on the size so that it scales correctly */
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
