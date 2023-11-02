<script>
	import NavbarTop from '$lib/components/NavbarTop.svelte';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';

	let viewDetails = false;
</script>

<NavbarTop />
<div class="wrapper">
	<div class="orange">
		<h1>Something's gone wrong...</h1>
		<br />
		<Button invertColor={true} on:click={() => (viewDetails = !viewDetails)}>
			{viewDetails ? 'Hide' : 'View'} Details
		</Button>
		{#if viewDetails}
			<br />
			<h3>Status: {$page.status}</h3>
			<h3>Message: {$page.error?.message}</h3>
		{/if}
		<br />
	</div>

	<div class="btn-container">
		<Button link="/app/home" invertColor={true} size={2.5}>Go home</Button>
	</div>
</div>

<style>
	.wrapper {
		padding: var(--navbar-top-height) 0 0 0;
		min-height: calc(100dvh - var(--navbar-top-height));
	}
	.btn-container {
		padding: 5rem;
	}
</style>
