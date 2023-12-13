<script>
	import BlurBgImg from '$lib/components/BlurBGImg.svelte';
	import Button from '$lib/components/Button.svelte';
	import NavbarTop from '$lib/components/NavbarTop.svelte';

	let navScaleFactor = 1.5;

	export let data;
</script>

<NavbarTop scaleFactor={navScaleFactor} />

<div class="content-container" style="--nav-scale-factor: {navScaleFactor}">
	<div class="orange">
		<h2>Shutterbug is a social media built to make photography fun...</h2>
	</div>
	<BlurBgImg url={data.photo} centerContents={false}>
		<div class="login-signup">
			<Button link="/auth/login" invertColor={true} size={2}>Log in</Button>
			<Button link="/auth/register" invertColor={true} size={2}>Register</Button>
		</div>
		<div class="explanation">
			<h2>...how it works:</h2>
			<p>Every week, a new one-word theme is released.</p>
			<p>You and your friends have that week to submit a photo you've taken, inspired by that theme.</p>
			<p>You then vote on your friends' submissions in 3 categories:</p>
			<div class="categories">
				<p class="humour category-text">Humour</p>
				<p class="link-word">,&nbsp</p>
				<p class="creativity category-text">Creativity</p>
				<p class="link-word">,&nbspand&nbsp</p>
				<p class="photography category-text">Photography</p>
			</div>
		</div>
	</BlurBgImg>
	<div class="footer">
		<p>Built by Thomas Alban</p>
	</div>
</div>

<style>
	.content-container {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		text-align: center;
		margin: calc(var(--navbar-top-height) * var(--nav-scale-factor)) 0 0 0;
		min-height: calc(100dvh - (var(--navbar-top-height) * var(--nav-scale-factor)));
		background-color: black;
	}
	.login-signup {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 0 2rem 0;
		gap: 1rem;
	}
	.explanation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 1rem 1rem 1rem;
	}
	.categories {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: wrap;
		gap: 0.5rem;
		--size: 1.25;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
	}
	.humour {
		background: linear-gradient(45deg, #854900 0%, var(--orange) 50%, #ebab5c 100%);
	}
	.creativity {
		background: linear-gradient(45deg, #25005e 0%, #6529c0 50%, #894ce5 100%);
	}
	.photography {
		background: linear-gradient(45deg, #005513 0%, #0eaa30 50%, #2bd052 100%);
	}
	.category-text {
		font-weight: bolder;
		font-size: 1.5em;
		padding: 0.25rem;
		text-shadow: 2px 2px black;
	}
	.link-word {
		--size: 1.5;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
	}
	.footer {
		color: white;
		padding: 0.5rem;
	}
</style>
