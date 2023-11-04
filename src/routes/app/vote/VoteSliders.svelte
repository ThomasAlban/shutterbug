<svelte:options accessors />

<script lang="ts">
	import Slider from './Slider.svelte';

	export let height = '12rem';

	export let values = {
		humour: 50,
		creativity: 50,
		photography: 50
	};

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

<div class="sliders-container" style="--border-size: {borderSize}; --height: {height};">
	<div class="slider-container">
		<p>Humour</p>
		<Slider colors={orangeColors} width="100%" height="100%" outerBorderSize={borderSize} bind:value={values.humour} />
	</div>
	<div class="slider-container">
		<p>Creativity</p>
		<Slider
			colors={purpleColors}
			width="100%"
			height="100%"
			outerBorderSize={borderSize}
			bind:value={values.creativity}
		/>
	</div>
	<div class="slider-container">
		<p>Photography</p>
		<Slider
			colors={greenColors}
			width="100%"
			height="100%"
			outerBorderSize={borderSize}
			bind:value={values.photography}
		/>
	</div>
</div>

<style>
	.sliders-container {
		display: grid;
		padding: var(--border-size);
		background-color: black;

		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		height: var(--height);
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
</style>
