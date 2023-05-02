<script>
	import { page } from '$app/stores';
</script>

{#if $page?.error}
	{#if $page?.error?.message}
		<h2>Error message: {$page?.error?.message}</h2>
	{/if}
	{#if $page?.status}
		<img src="https://http.cat/{$page.status}" alt="HTTP Error" width="600" />
	{/if}
{/if}
