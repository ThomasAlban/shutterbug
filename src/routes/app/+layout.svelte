<script lang="ts">
	import NavbarBottom from '$lib/components/NavbarBottom.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';
	import { onMount } from 'svelte';

	export let data;

	let windowHeight = '100vh';
	onMount(() => {
		windowHeight = window.innerHeight.toString() + 'px';
	});
</script>

<NavbarTop />
<div class="content-container" style="--window-height: {windowHeight}">
	<slot />
</div>

<NavbarBottom userID={data.user.userID} />

<style>
	.content-container {
		margin: 5rem 0 5rem 0;
		min-height: calc(var(--window-height) - 10rem);
	}
</style>
