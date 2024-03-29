<script lang="ts">
	import FormButton from '$lib/components/FormButton.svelte';
	import FriendButtons from '$lib/components/FriendButtons.svelte';
	import PhotoSubmission from '$lib/components/PhotoSubmission.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import ReportButton from '$lib/components/ReportButton.svelte';
	import { getTimeFromOrToNow } from '$lib/util';
	import { onMount } from 'svelte';

	export let data;
	$: ({ userData } = data);
	$: ({ friendStatus, user, submissionsCount } = userData);

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

<!-- this contains all the info about the user -->
<div class="orange">
	<div class="profile-picture-container">
		<!-- display the profile picture -->
		<ProfilePicture src={user.profilePhoto} size={10} imgWidth={150} />
	</div>
	<div>
		<!-- display the username, and if they are friends, a friend icon -->
		<h1 class="username" style="--font-sub: {fontSub}rem;" bind:clientWidth={h1Width}>
			{user.username}
			{#if friendStatus === 'friends'}
				<img src="/icons/users.png" alt="friends-icon" style="height: 1em;" />
			{/if}
		</h1>
	</div>
	<!-- display friend buttons (accept/request/etc) if this is not their own user page -->
	{#if friendStatus !== 'self'}
		<FriendButtons {user} {friendStatus} type="text" />
	{/if}

	<!-- display how long ago the account was created -->
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
		<!-- note: &nbsp means whitespace character -->
		&nbsp·&nbsp {submissionsCount > 0 ? submissionsCount : 'No'} submission{submissionsCount == 1 ? '' : 's'}
	</p>
	{#if (friendStatus === 'friends' || friendStatus === 'incomingRequest' || friendStatus === 'self') && submissionsCount}
		<p>Past submissions:</p>
	{/if}
</div>

<!-- display the photo submissions -->
{#if userData.reported === 'none' && (userData.friendStatus === 'incomingRequest' || userData.friendStatus === 'friends' || userData.friendStatus === 'self')}
	<div class="photo-submissions-container">
		{#each userData.photoSubmissions as photoSubmission}
			<div class="grid-item">
				<PhotoSubmission {photoSubmission} />
			</div>
		{/each}
	</div>
{/if}

<!-- allow the user to report this user if they haven't already, and if they have, withdraw their report -->
{#if userData.reported === 'reporter'}
	<div class="report-info-container">
		<p>You have reported this user.</p>
		<FormButton invertColor={true} size={0.75} action="?/deleteReport">Withdraw Report</FormButton>
	</div>
{:else if userData.friendStatus !== 'self'}
	<ReportButton />
{/if}

<style>
	/* display the photo submissions in a grid layout */
	.photo-submissions-container {
		display: grid;
		grid-template-columns: auto auto auto;

		/* this means that the grid will have 2 columns when the screen width is 
        larger than 35 rem, but 1 column otherwise */
		grid-template-columns: repeat(1, minmax(0, 1fr));
		@media (min-width: 35rem) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		/* very light grey background */
		background-color: rgb(235, 235, 235);
	}
	/* each photo submission is shown in here */
	.grid-item {
		background-color: rgba(255, 255, 255, 0.8);
		text-align: center;
		border: 1px solid black;
	}
	/* container showing all the info about the user */
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

		/* calculate the font size based on the size variable defined above
        it will shrink if the viewport is smaller than a certain value
        and it will also shrink if the updateWidth function sets a non-zero --font-sub amount */
		font-size: calc(min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw)) - var(--font-sub));
	}
	.report-info-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 1rem;
		gap: 0.5rem;
	}
</style>
