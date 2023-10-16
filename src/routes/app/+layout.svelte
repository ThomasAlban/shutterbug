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
		padding: 5rem 0 5rem 0;
		min-height: calc(100vh - 10rem);
		/* cater for the ios address bar */
		min-height: calc(-webkit-fill-available - 10rem);
		background-color: blue;
	}
</style>
