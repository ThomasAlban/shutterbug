<script>
	import Button from '$lib/components/Button.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';

	let navScaleFactor = 1.5;
</script>

<!-- <a href="/auth/login">Login</a> <br />
<a href="/auth/register">Register</a> -->

<NavbarTop scaleFactor={navScaleFactor} />

<div class="content-container" style="--nav-scale-factor: {navScaleFactor}">
	<div class="orange">
		<h2>Shutterbug is a social media built to make photography fun</h2>
	</div>
	<div class="login-signup">
		<Button link="/auth/login" invertColor={true} size={2}>Log in</Button>
		<Button link="/auth/register" invertColor={true} size={2}>Register</Button>
	</div>
</div>

<style>
	.content-container {
		text-align: center;
		margin: calc(var(--navbar-top-height) * var(--nav-scale-factor)) 0 0 0;
		min-height: calc(100dvh - (var(--navbar-top-height) * var(--nav-scale-factor)));
		background-color: white;
	}
	.login-signup {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 0 2rem 0;
		gap: 1rem;
	}
</style>
