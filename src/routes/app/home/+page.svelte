<script lang="ts">
	// this is the data returned from the load function
	export let data;
	$: ({ user, currentTheme, alreadySubmitted } = data);

	let remaining: { days: number; hours: number; minutes: number; seconds: number } | undefined =
		undefined;

	// this function runs every second and updates the remaining variable above
	function updateRemaining() {
		let currentDate = new Date();
		if (currentTheme) {
			let timeDiff = currentTheme.dateEnd.getTime() - currentDate.getTime();
			let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
			remaining = { days, hours, minutes, seconds };
		}
	}

	let interval = setInterval(updateRemaining, 1000);

	$: if (alreadySubmitted) clearInterval(interval);
</script>

welcome, {user.username}! <br />

{#if currentTheme}
	Current theme is: <b>{currentTheme.theme}</b>. <br />

	{#if !alreadySubmitted}
		<!-- display the countdown -->
		You have until {currentTheme.dateEnd.toLocaleDateString()}, {currentTheme.dateEnd.toLocaleTimeString()}
		to enter.
		<br />

		{#if remaining}
			{remaining.days} days, {remaining.hours} hours, {remaining.minutes} minutes, {remaining.seconds}
			seconds
		{/if}
		<br />
		<a href="/app/upload">Upload photo for current theme</a>
	{:else}
		You have already submitted a photo.
	{/if}
{:else}
	There is no current theme.
{/if}

<br /> <br />

<a href="/app/vote">View and vote on your friends' submissions from the previous week</a>

<br /><br />

<a href="/app/friends">View and add friends</a>

<br /><br />

<form action="/auth/logout" method="post">
	<button type="submit">Log Out</button>
</form>
