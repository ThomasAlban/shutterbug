<script lang="ts">
	import { onMount } from 'svelte';

	let windowHeight = '100vh';
	onMount(() => {
		windowHeight = window.innerHeight.toString() + 'px';
	});
</script>

<div class="background">
	<div class="app-container">
		<slot />
	</div>
</div>

<style>
	.background {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.app-container {
		width: min(100%, 50rem);
		min-height: var(--window-height);
		box-shadow: 0 0 3rem 0.5rem;
		line-height: 2rem;
	}
</style>
