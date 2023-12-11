<script lang="ts">
	import { enhance } from '$app/forms';
	import FriendButtons from '$lib/components/FriendButtons.svelte';
	import PhotoSubmission from '$lib/components/PhotoSubmission.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { getTimeFromOrToNow, vw2px } from '$lib/util';
	import { onMount } from 'svelte';

	export let data;
	$: ({ userData } = data);
	$: ({ friendStatus, user, submissionsCount } = userData);

	let reportFormVisible = false;
	let reportReasonVisible = false;

	$: accountCreated = (() => {
		if (!userData) return undefined;
		let timeSinceCreated = getTimeFromOrToNow(userData.user.dateCreated, false);
		return { years: timeSinceCreated.years, months: timeSinceCreated.months, days: timeSinceCreated.days };
	})();

	let fontSub = 0;
	let windowWidth: number;
	let h1Width: number;

	onMount(updateWidth);

	$: windowWidth, updateWidth();

	function updateWidth() {
		if (!h1Width) return;

		const maxWidth = windowWidth * 0.9;

		// if the content is overflowing or bigger then the maximum width
		if (h1Width > maxWidth) {
			// run the function again after the DOM updates
			setTimeout(updateWidth, 1);
			// make the font a little smaller
			fontSub += 0.01;
		}

		const errorBound = 30;
		// if the font size could be bigger than it currently is, and still remain within the maximum width specified (and the font is smaller than normal)
		if (maxWidth - h1Width > errorBound && fontSub > 0) {
			// run the function again after the DOM updates
			setTimeout(updateWidth, 1);
			// make the font a litle bigger
			fontSub -= 0.01;
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="orange">
	<div class="profile-picture-container">
		<ProfilePicture src={user.profilePhoto} size={10} imgWidth={150} />
	</div>
	<div>
		<h1 class="username" style="--font-sub: {fontSub}rem;" bind:clientWidth={h1Width}>
			{user.username}
			<img src="/icons/users.png" alt="friends-icon" style="height: 1em;" />
		</h1>
	</div>

	<FriendButtons {user} {friendStatus} type="text" />

	<p>
		{#if accountCreated}
			Account created
			{#if accountCreated.years}
				{accountCreated.years},
				{#if accountCreated.months}
					{accountCreated.months} months
				{/if}
			{:else}
				{accountCreated.days} days
			{/if}
			ago
		{/if}
		{#if submissionsCount}
			<!-- note: &nbsp means whitespace character -->
			&nbsp·&nbsp {submissionsCount} submission{submissionsCount > 1 ? 's' : ''}
		{/if}
	</p>
</div>

{#if userData.reported === 'none' && (userData.friendStatus === 'incomingRequest' || userData.friendStatus === 'friends' || userData.friendStatus === 'self')}
	<div class="photo-submissions-container">
		{#each userData.photoSubmissions as photoSubmission}
			<div class="grid-item">
				<PhotoSubmission {photoSubmission} />
			</div>
		{/each}
	</div>
{/if}

{#if userData.reported === 'reporter'}
	<i>You have reported this user.</i>
	<form
		method="post"
		action="?/deleteReport"
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'true');
			return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
		}}
	>
		<input type="submit" value="Delete Report" />
	</form>
{:else if userData.friendStatus !== 'self'}
	<button hidden={reportFormVisible} on:click={() => (reportFormVisible = true)}>Report User</button>

	{#if reportFormVisible}
		<h2>Report User</h2>
		<button hidden={reportReasonVisible} on:click={() => (reportReasonVisible = true)}>Include Reason</button>
		{#if reportReasonVisible}
			<textarea form="reportform" name="reason" placeholder="reason..." />
		{/if}
		<form
			method="post"
			action="?/report"
			id="reportform"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) =>
					update().then(() => {
						submitter?.removeAttribute('disabled');
						reportFormVisible = false;
						reportReasonVisible = false;
					});
			}}
		>
			<input type="submit" value="Send Report" />
		</form>
	{/if}
{/if}

<style>
	.photo-submissions-container {
		display: grid;
		grid-template-columns: auto auto auto;

		/* this means that the grid will have 2 columns when the screen width is larger than 35 rem, but 1 column otherwise */
		grid-template-columns: repeat(1, minmax(0, 1fr));
		@media (min-width: 35rem) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		background-color: lightgray;
	}
	.grid-item {
		background-color: rgba(255, 255, 255, 0.8);
		text-align: center;
		border: 1px solid black;
	}
	.orange {
		z-index: 2;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.profile-picture-container {
		font-size: min(1rem, calc(var(--rem-vw-ratio) * 1vw));
		line-height: 1;
	}
	.username {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		--size: 3;

		font-size: calc(min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw)) - var(--font-sub));
	}
</style>
