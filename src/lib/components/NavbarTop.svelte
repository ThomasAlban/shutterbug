<script lang="ts">
	export let scaleFactor = 1;
</script>

<div class="navbar" style="--scale: {scaleFactor}">
	<img src="/logo-transparent.png" alt="shutterbug-logo" />
</div>

<style>
	.navbar {
		background-color: black;
		overflow: hidden;
		z-index: 10;

		position: fixed;
		top: 0;
		margin-left: auto;
		margin-right: auto;
		width: min(100%, var(--max-app-width));
		height: calc(var(--navbar-top-height) * var(--scale));

		display: flex;
		justify-content: center;
		align-items: center;
	}
	img {
		height: calc(var(--navbar-top-height) * var(--scale));
	}
</style>
