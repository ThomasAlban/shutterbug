<script lang="ts">
	import Slider from './Slider.svelte';

	export let photo = 'https://res.cloudinary.com/dsuadxci8/image/upload/v1698784717/tsektxnwrtxpocduglgm.jpg';

	const orangeColors = {
		gradZero: '#b66909',
		gradFifty: 'var(--orange)',
		gradHundred: '#f8c381'
	};
	const purpleColors = {
		gradZero: '#38028a',
		gradFifty: '#702fcf',
		gradHundred: '#ba8efb'
	};
	const greenColors = {
		gradZero: '#02791c',
		gradFifty: '#17c23d',
		gradHundred: '#90fea9'
	};

	const borderSize = '0.4rem';
</script>

<div class="vote-container">
	<div class="photo" style="background-image: url({photo});" />
	<div class="sliders-container" style="--border-size: {borderSize}">
		<div class="slider-container">
			<p>Humour</p>
			<Slider colors={orangeColors} width="100%" height="100%" outerBorderSize={borderSize} />
		</div>
		<div class="slider-container">
			<p>Creativity</p>
			<Slider colors={purpleColors} width="100%" height="100%" outerBorderSize={borderSize} />
		</div>
		<div class="slider-container">
			<p>Photography</p>
			<Slider colors={greenColors} width="100%" height="100%" outerBorderSize={borderSize} />
		</div>
	</div>
</div>

<style>
	.vote-container {
		width: 100%;
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height));
		background-color: red;
		display: flex;
		flex-flow: column;
	}
	.sliders-container {
		display: grid;
		padding: var(--border-size);
		background-color: black;

		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		flex: 0 1 12rem;
	}
	.slider-container {
		display: flex;

		color: white;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;
	}
	.photo {
		flex: 1 1 auto;
		background-repeat: no-repeat;
		background-size: cover;
		background-clip: border-box;
		background-position: center;
	}
</style>
