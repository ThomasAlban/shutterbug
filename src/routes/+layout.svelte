<script lang="ts">
	$: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<div class="background" style="--window-height: {innerHeight}px">
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
		min-height: calc(var(--window-height) - 10rem);
		box-shadow: 0 0 3rem 0.5rem;
		line-height: 2rem;
	}
</style>
