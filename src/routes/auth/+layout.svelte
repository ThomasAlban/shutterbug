<script lang="ts">
	import NavbarTop from '$lib/components/NavbarTop.svelte';
</script>

<!-- this displays the top navbar on all routes starting with '/auth' -->
<NavbarTop />

<div class="content-container">
	<!-- page gets inserted here -->
	<slot />
</div>

<style>
	.content-container {
		/* make the content container a bit smaller on the top to accomodate for the navbar */
		margin: var(--navbar-top-height) 0 0 0;
		min-height: calc(100dvh - var(--navbar-top-height));
		background-color: white;
	}
</style>
