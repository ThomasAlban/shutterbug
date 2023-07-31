<script lang="ts">
	// this is the data returned from the load function
	export let data;
	$: ({ user, theme } = data);

	let remaining: { days: number; hours: number; minutes: number; seconds: number } | undefined =
		undefined;

	function updateRemaining() {
		let currentDate = new Date();
		if (theme) {
			let timeDiff = theme.dateEnd.getTime() - currentDate.getTime();
			let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
			remaining = { days, hours, minutes, seconds };
		}
	}

	setInterval(updateRemaining, 1000);
</script>

welcome, {user.username}! <br />

{#if theme}
	Current theme is: <b>{theme.theme}</b>. <br />
	You have until {theme.dateEnd.toLocaleDateString()}, {theme.dateEnd.toLocaleTimeString()} to enter.
	<br />
	{#if remaining}
		{remaining.days} days, {remaining.hours} hours, {remaining.minutes} minutes, {remaining.seconds}
		seconds
	{/if}
	<br />
	<a href="/app/upload">Upload Photo</a>
{:else}
	There is no current theme.
{/if}

<br /><br />

<a href="/auth/logout">Log Out</a>
