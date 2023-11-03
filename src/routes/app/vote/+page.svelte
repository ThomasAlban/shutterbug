<script lang="ts">
	import { onMount } from 'svelte';
	import Vote from './Vote.svelte';

	export let data;
	$: ({ friendsWithSubmissions, previousTheme } = data);
</script>

<div class="votes-container">
	{#each friendsWithSubmissions as user}
		{#if user.photoSubmission}
			<div class="vote-container">
				<Vote photo={user.photoSubmission} />
			</div>
			<!-- {user.user.username}
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
		{/if} -->
		{/if}
	{:else}
		There are no submissions.
	{/each}
</div>

<style>
	.vote-container {
		scroll-snap-align: start;
		scroll-margin: var(--navbar-top-height);
	}
</style>
