<script lang="ts">
	import BlurBgImg from '$lib/components/BlurBGImg.svelte';
	import Button from '$lib/components/Button.svelte';
	import '$lib/style.css';
	// this is the data returned from the load function
	export let data;
	$: ({ user, currentTheme, alreadySubmitted, nextTheme } = data);

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
	}

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
			<p class="small-text">There is no current theme.</p>
		{/if}

		{#if remaining && (currentTheme || nextTheme)}
			<p class="small-text">
				There
				{remaining.days == 1 ||
				(!remaining.days && remaining.hours == 1) ||
				(!remaining.days && !remaining.hours && remaining.minutes == 1) ||
				(!remaining.days && !remaining.hours && !remaining.minutes && remaining.seconds == 1)
					? 'is'
					: 'are'}:
			</p>
			<p class="large-text">
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
			</p>
		{/if}

		{#if currentTheme}
			<p class="small-text">until photo submission!</p>
			<div class="submit-container">
				<Button fontSize={2} link="/app/upload" invertColor={true}>Submit now</Button>
			</div>
		{:else if nextTheme}
			<p class="small-text">until the next theme starts!</p>
		{/if}
	</div>
	<div class="blurbg-container">
		<BlurBgImg url={data.randomSubmission}>
			<div>
				<p class="medium-text">View & vote on your friends' submissions for last week</p>
				<br />
			</div>
			<Button fontSize={2} link="/app/vote" invertColor={true}>Start voting</Button>
		</BlurBgImg>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-flow: column;
		height: calc(100vh - 10rem);
	}
	.orange {
		flex: 0 1 auto;
	}
	.blurbg-container {
		flex: 1 1 auto;
	}
	.submit-container {
		padding: 1rem;
	}
</style>
