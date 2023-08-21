<script lang="ts">
	export let data;
	$: ({ friendsWithPhotos } = data);
</script>

<a href="/app/home">Home</a> <br /> <br />

{#each friendsWithPhotos as friend}
	{#if friend.photo}
		{friend.name}
		<br />
		<img src={friend.photo} referrerpolicy="no-referrer" width="200px" alt={friend.name} />
		<br /> <br />

		<form method="post" action="?/vote&friendID={friend.ID}">
			<label for="humour">Humour Vote</label>
			<input type="number" id="humour" name="humour" min="0" max="9" step="1" value="5" />
			<br />
			<label for="creativity">Creativity Vote</label>
			<input type="number" id="creativity" name="creativity" min="0" max="9" step="1" value="5" />
			<br />
			<label for="photography">Photography Vote</label>
			<input type="number" id="photography" name="photography" min="0" max="9" step="1" value="5" />
			<br />
			<input type="submit" value="Submit vote" />
		</form>

		<br />
	{/if}
{:else}
	You have voted on all your friends' submissions.
{/each}
