<script lang="ts">
	import NavbarTop from '$lib/components/NavbarTop.svelte';
</script>

<NavbarTop />

<div class="container">
	<slot />
</div>

<style>
	.container {
		overflow-x: hidden;
		overflow-y: auto;
		height: calc(100vh - 5rem);
	}
</style>
