<script lang="ts">
	export let data;
	$: ({ friends } = data);
</script>

{#each friends as friend}
	{#if friend.photo}
		{friend.name}
		<br />

		<img src={friend.photo} width="200px" alt={friend.name} />

		<br /> <br />
	{/if}
{/each}
