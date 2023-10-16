<script lang="ts">
	import NavbarTop from '$lib/components/NavbarTop.svelte';
</script>

<NavbarTop />

<div class="container">
	<slot />
</div>

<style>
	.container {
		margin-top: 5rem;
		height: calc(100vh - 10rem);
		height: calc(-webkit-fill-available - 10rem);

		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
