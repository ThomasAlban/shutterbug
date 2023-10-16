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
		height: 100vh;
		height: -webkit-fill-available;
		box-shadow: 0 0 3rem 0.5rem;
		line-height: 2rem;
	}
</style>
