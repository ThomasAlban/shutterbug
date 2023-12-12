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
		margin: var(--navbar-top-height) 0 var(--navbar-bottom-height) 0;
		min-height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height));
		background-color: white;
	}
</style>
