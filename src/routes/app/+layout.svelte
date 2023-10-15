<script lang="ts">
	import NavbarBottom from '$lib/components/NavbarBottom.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';

	export let data;
</script>

<NavbarTop />
<div class="container">
	<slot />
</div>

<NavbarBottom userID={data.user.userID} />

<style>
	.container {
		overflow-x: hidden;
		overflow-y: auto;
		height: calc(100vh - 10rem);
	}
</style>
