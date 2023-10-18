<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import BlurBgImg from '$lib/components/BlurBGImg.svelte';
	import Button from '$lib/components/Button.svelte';

	// this is the data returned from the load function
	export let data;
	console.log(data.hasFriends);
	$: ({ currentTheme, alreadySubmitted, nextTheme } = data);

	let remaining: { days: number; hours: number; minutes: number; seconds: number } | undefined = undefined;

	// this function runs every second and updates the remaining variable above
	function updateRemaining(dateUntil: Date) {
		let currentDate = new Date();
		let timeDiff = dateUntil.getTime() - currentDate.getTime();
		let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
		remaining = { days, hours, minutes, seconds };

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
			console.log(nextTheme);
			updateRemaining(nextTheme.dateEnd);
			setInterval(updateRemaining, 1000, nextTheme.dateEnd);
		}
	}
</script>

<div class="wrapper">
	<div class="orange">
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
			<div class="submit-container">
				<Button link="/app/upload" invertColor={true}>Submit now</Button>
			</div>
		{:else if nextTheme}
			<p>until the next theme starts!</p>
		{/if}
	</div>
	<div class="blurbg-container">
		{#if data.randomSubmission}
			<BlurBgImg url={data.randomSubmission}>
				<div>
					<h3>View & vote on your friends' submissions for last week</h3>
					<br />
				</div>
				<Button link="/app/vote" invertColor={true}>Start voting</Button>
			</BlurBgImg>
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
		height: calc(var(--window-height) - var(--navbar-top-height) - var(--navbar-bottom-height));
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
</style>
