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
		margin-top: 5rem;
		margin-bottom: 5rem;
		height: calc(100vh - 10rem);
		height: calc(-webkit-fill-available - 10rem);

		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
