<script lang="ts">
	import NavbarBottom from '$lib/components/NavbarBottom.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';

	export let data;
</script>

<NavbarTop />

<div class="content-container">
	<slot />
</div>

<NavbarBottom userID={data.user.userID} />

<style>
	.content-container {
		margin: 5rem 0 5rem 0;
		min-height: calc(var(--window-height) - var(--navbar-top-height) - var(--navbar-bottom-height));
		background-color: white;
	}
</style>
