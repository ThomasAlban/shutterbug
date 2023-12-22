<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import BlurBgImg from '$lib/components/BlurBGImg.svelte';
	import Button from '$lib/components/Button.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { getTimeFromOrToNow, successToast } from '$lib/util';
	import { PUBLIC_VAPID_KEY } from '$env/static/public';

	// this is the data returned from the load function
	export let data;

	$: ({ currentTheme, alreadySubmitted, nextTheme, submissionsToVoteOn } = data);

	// variable used to track remaining time until the end of the current theme
	let remaining: { days: number; hours: number; minutes: number; seconds: number } | undefined = undefined;

	// this function runs every second and updates the remaining variable above
	function updateRemaining(dateUntil: Date) {
		remaining = getTimeFromOrToNow(dateUntil, true);
		// patch to make sure nothing can be negative
		if (Object.values(remaining).every((x) => x <= 0)) remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	// if 'remaining' goes below or equal to zero, refresh the page
	$: if (remaining && browser && Object.values(remaining).every((x) => x <= 0)) invalidateAll();

	// if there is a current theme and they have not submitted yet, count down to the end of the current theme
	// if there is no current theme but a theme coming up, count down until that next theme starts
	$: {
		if (currentTheme && !alreadySubmitted) {
			updateRemaining(currentTheme.dateEnd);
			setInterval(updateRemaining, 1000, currentTheme.dateEnd);
		} else if (nextTheme) {
			updateRemaining(nextTheme.dateEnd);
			setInterval(updateRemaining, 1000, nextTheme.dateEnd);
		}
	}
	let deleteSubmissionConfirm = false;

	$: notificationsAllowed = browser ? Notification.permission === 'granted' : true;

	async function allowNotifications() {
		let sw = await navigator.serviceWorker.ready;
		let subscription = await sw.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_VAPID_KEY
		});
		await fetch('/app/home', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(subscription)
		});
		notificationsAllowed = Notification.permission === 'granted';
		successToast('Success', 'You can now receive notifications!');
	}
</script>

<div class="wrapper">
	<!-- orange section at top of page -->
	<div class="orange">
		<!-- lots of if statements used here to display correct theme information -->
		{#if !alreadySubmitted}
			{#if !currentTheme}
				<!-- if there is no current theme -->
				<p>There is no current theme.</p>
			{/if}

			{#if remaining && (currentTheme || nextTheme)}
				<!-- if we are counting down to either the end of the current theme or the start of the next -->
				<p>
					<!-- display 'There is' or 'There are' depending on the circumstance -->
					There
					{remaining.days == 1 ||
					(!remaining.days && remaining.hours == 1) ||
					(!remaining.days && !remaining.hours && remaining.minutes == 1) ||
					(!remaining.days && !remaining.hours && !remaining.minutes && remaining.seconds == 1)
						? 'is'
						: 'are'}:
				</p>
				<h2>
					<!-- display the remaining days, hours, minutes, seconds -->
					{#if remaining.days}
						{remaining.days} {remaining.days == 1 ? 'day' : 'days'},
					{/if}
					{#if remaining.hours}
						{remaining.hours} {remaining.hours == 1 ? 'hour' : 'hours'},
					{/if}
					{#if remaining.days && remaining.hours}<br />{/if}
					{#if remaining.minutes}
						{remaining.minutes} {remaining.minutes == 1 ? 'minute' : 'minutes'},
					{/if}
					{#if !remaining.days && remaining.hours && remaining.minutes}<br />{/if}
					{remaining.seconds}
					{remaining.seconds == 1 ? 'second' : 'seconds'}
				</h2>
			{/if}

			{#if currentTheme}
				<!-- say 'until photo submission', and what the current theme is -->
				<p>until photo submission!</p>
				<p>The theme is:</p>
				<h1>{currentTheme.theme}</h1>
				<!-- link to submit photo for theme -->
				<div class="submit-container">
					<Button link="/app/upload" invertColor={true}>Submit now</Button>
				</div>
			{:else if nextTheme}
				<!-- say 'until the next theme starts' if we are counting down to the next theme -->
				<p>until the next theme starts!</p>
			{/if}
		{:else if currentTheme}
			<!-- if we cgt to here then they have already submitted a photo for the current theme -->
			<!-- display the theme info and say that they have already submitted a photo for this theme -->
			<p>The theme is:</p>
			<h2>{currentTheme.theme}</h2>
			<p>You've already submitted a photo for this theme.</p>

			<!-- display a delete submission UI -->
			<div class="delete-submission-container">
				{#if deleteSubmissionConfirm}
					<p>Are you sure you want to delete your submission?</p>
					<div class="delete-submission-buttons">
						<FormButton action="?/deleteSubmission&themeID={currentTheme.themeID}" invertColor={true} size={1}>
							Yes
						</FormButton>
						<Button invertColor={true} size={1} on:click={() => (deleteSubmissionConfirm = false)}>No</Button>
					</div>
				{:else}
					<Button size={1} invertColor={true} on:click={() => (deleteSubmissionConfirm = true)}
						>Delete Submission</Button
					>
				{/if}
			</div>
		{/if}
	</div>

	{#if !notificationsAllowed}
		<div class="notif-request">
			<p>Allow notifications to keep up to date with themes!</p>
			<Button on:click={allowNotifications}>Allow</Button>
		</div>
	{/if}

	<!-- blurred background section that takes up the rest of the page -->
	<div class="blurbg-container">
		{#if data.randomSubmission}
			<!-- display a blurred background of a random submission -->
			<BlurBgImg url={data.randomSubmission}>
				<div class="vote-info-container">
					<!-- UI to vote on friends' submissions if they are available -->
					{#if submissionsToVoteOn}
						<div>
							<h3>View & vote on your friends' submissions for last week</h3>
							<br />
						</div>
						<Button link="/app/vote" invertColor={true}>Start voting</Button>
					{:else}
						<h3>You've already voted on all the submissions for last week.</h3>
					{/if}
				</div>
			</BlurBgImg>
		{:else if data.hasFriends}
			<!-- if there is no submission but they have friends -->
			<h3>None of your friends submitted anything last week.</h3>
			{#if currentTheme}
				<p>Check again once the current theme is over!</p>
			{:else}
				<p>Check again soon!</p>
			{/if}
		{:else}
			<!-- if they have no friends -->
			<!-- display a prompt to make some friends -->
			<h3>You don't have any friends.</h3>
			<p>Get some friends to vote on your submissions!</p>
			<h3>
				Click the <img src="/icons/users.png" alt="friends-icon" class="friends-icon" /> icon below...
			</h3>
		{/if}
	</div>
</div>

<style>
	/* wrapper for the whole page */
	.wrapper {
		line-height: 3rem;
		text-align: center;
		display: flex;
		flex-flow: column;
		min-height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height));
	}
	.orange {
		/* make the orange part of the page only take up the amount of space it needs to */
		flex: 0 1 auto;
	}

	.blurbg-container {
		/* make the blurred part of the page take up the rest of the available spage on the page */
		flex: 1 1 auto;
		color: black;

		/* center everything */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.submit-container {
		padding: 1rem;
	}
	.friends-icon {
		height: 1em;
		/* make the friends icon appear as black by applying filter */
		filter: brightness(0);
	}
	.delete-submission-container {
		padding: 0.5rem;
	}
	.delete-submission-buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}
	.vote-info-container {
		padding: 3rem;
	}
	.notif-request {
		display: flex;
		justify-content: space-around;
		gap: 0.5rem;
		padding: 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
		align-items: center;
	}
</style>
