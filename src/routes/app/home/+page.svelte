<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import BlurBgImg from '$lib/components/BlurBGImg.svelte';
	import Button from '$lib/components/Button.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { getTimeFromOrToNow } from '$lib/util';

	// this is the data returned from the load function
	export let data;

	$: ({ currentTheme, alreadySubmitted, nextTheme, submissionsToVoteOn } = data);

	let remaining: { days: number; hours: number; minutes: number; seconds: number } | undefined = undefined;

	// this function runs every second and updates the remaining variable above
	function updateRemaining(dateUntil: Date) {
		remaining = getTimeFromOrToNow(dateUntil, true);
		// patch to make sure nothing can be negative
		if (Object.values(remaining).every((x) => x <= 0)) remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	// if 'remaining' goes below or equal to zero, refresh the page
	$: if (remaining && browser && Object.values(remaining).every((x) => x <= 0)) invalidateAll();

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
</script>

<div class="wrapper">
	<div class="orange">
		{#if !alreadySubmitted}
			{#if !currentTheme}
				<p>There is no current theme.</p>
			{/if}

			{#if remaining && (currentTheme || nextTheme)}
				<p>
					There
					{remaining.days == 1 ||
					(!remaining.days && remaining.hours == 1) ||
					(!remaining.days && !remaining.hours && remaining.minutes == 1) ||
					(!remaining.days && !remaining.hours && !remaining.minutes && remaining.seconds == 1)
						? 'is'
						: 'are'}:
				</p>
				<h2>
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
				<p>until photo submission!</p>
				<p>The theme is:</p>
				<h1>{currentTheme.theme}</h1>
				<div class="submit-container">
					<Button link="/app/upload" invertColor={true}>Submit now</Button>
				</div>
			{:else if nextTheme}
				<p>until the next theme starts!</p>
			{/if}
		{:else if currentTheme}
			<p>The theme is:</p>
			<h2>{currentTheme.theme}</h2>
			<p>You've already submitted a photo for this theme.</p>

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
	<div class="blurbg-container">
		{#if data.randomSubmission}
			<BlurBgImg url={data.randomSubmission}>
				{#if submissionsToVoteOn}
					<div>
						<h3>View & vote on your friends' submissions for last week</h3>
						<br />
					</div>
					<Button link="/app/vote" invertColor={true}>Start voting</Button>
				{:else}
					<h3>You've already voted on all the submissions for last week.</h3>
				{/if}
			</BlurBgImg>
		{:else if data.hasFriends}
			<h3>None of your friends submitted anything last week.</h3>
			{#if currentTheme}
				<p>Check again once the current theme is over!</p>
			{:else}
				<p>Check again soon!</p>
			{/if}
		{:else}
			<h3>You don't have any friends.</h3>
			<p>Get some friends to vote on your submissions!</p>
			<h3>
				Click the <img src="/icons/users.png" alt="friends-icon" class="friends-icon" /> icon below...
			</h3>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		line-height: 3rem;
		text-align: center;
		display: flex;
		flex-flow: column;
		min-height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height));
	}
	.orange {
		flex: 0 1 auto;
	}

	.blurbg-container {
		flex: 1 1 auto;
		color: black;

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
</style>
