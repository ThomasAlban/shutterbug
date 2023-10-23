<script lang="ts">
	import NavbarTop from '$lib/components/NavbarTop.svelte';
</script>

<NavbarTop />

<div class="content-container">
	<slot />
</div>

<style>
	.content-container {
		margin: var(--navbar-top-height) 0 0 0;
		min-height: calc(100dvh - var(--navbar-top-height));
		background-color: white;
	}
</style>
