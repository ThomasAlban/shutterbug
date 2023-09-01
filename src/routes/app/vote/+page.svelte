<script lang="ts">
	export let data;
	$: ({ friendsWithSubmissions, previousTheme } = data);
</script>

<a href="/app/home">Home</a> <br /> <br />

Last week's theme was: {previousTheme.theme} <br /><br />

{#each friendsWithSubmissions as user}
	{#if user.photoSubmission}
		{user.user.username}
		<br />
		<img src={user.photoSubmission} referrerpolicy="no-referrer" width="200px" alt={user.user.username} />
		<br /> <br />

		{#if user.vote}
			Overall humour Vote: {user.vote.overallVote.humour} <br />
			Overall creativity Vote: {user.vote.overallVote.creativity} <br />
			Overall photography Vote: {user.vote.overallVote.photography} <br />
		{:else}
			<form method="post" action="?/vote">
				<input type="hidden" value={user.user.userID} name="ID" />
				<label for="humour">Humour Vote</label>
				<input type="number" name="humour" min="0" max="10" step="1" value="5" />
				<br />
				<label for="creativity">Creativity Vote</label>
				<input type="number" name="creativity" min="0" max="10" step="1" value="5" />
				<br />
				<label for="photography">Photography Vote</label>
				<input type="number" name="photography" min="0" max="10" step="1" value="5" />
				<br />
				<input type="submit" value="Submit vote" />
			</form>
		{/if}

		<br />
	{/if}
{:else}
	There are no submissions.
{/each}
