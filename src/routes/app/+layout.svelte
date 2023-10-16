<script lang="ts">
	import NavbarBottom from '$lib/components/NavbarBottom.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';

	export let data;

	$: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<NavbarTop />

<div class="content-container" style="--window-height: {innerHeight}px">
	<slot />
</div>

<NavbarBottom userID={data.user.userID} />

<style>
	.content-container {
		margin: 5rem 0 5rem 0;
		min-height: calc(var(--window-height) - 10rem);
	}
</style>
