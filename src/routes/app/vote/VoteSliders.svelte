<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';
	import Slider from '$lib/components/Slider.svelte';

	export let height = '12rem';

	export let values = {
		humour: 50,
		creativity: 50,
		photography: 50
	};

	// set the values to defaults on mount
	onMount(() => {
		values = {
			humour: 50,
			creativity: 50,
			photography: 50
		};
	});

	const borderSize = '0.4rem';
</script>

<div class="sliders-container" style="--border-size: {borderSize}; --height: {height};">
	<!-- display each slider, with a heading of 'Humour' 'Creativity' or 'Photography' -->
	<!-- bind the value of the slider to the values object defined above -->
	<div class="slider-container">
		<p>Humour</p>
		<Slider color="orange" width="100%" height="100%" outerBorderSize={borderSize} bind:value={values.humour} />
	</div>
	<div class="slider-container">
		<p>Creativity</p>
		<Slider color="purple" width="100%" height="100%" outerBorderSize={borderSize} bind:value={values.creativity} />
	</div>
	<div class="slider-container">
		<p>Photography</p>
		<Slider color="green" width="100%" height="100%" outerBorderSize={borderSize} bind:value={values.photography} />
	</div>
</div>

<style>
	/* container for the 3 sliders */
	/* uses grid layout to display the 3 sliders next to each other */
	.sliders-container {
		overflow: hidden;
		display: grid;
		padding: var(--border-size);
		background-color: black;

		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		height: var(--height);
	}
	/* container for each slider and the heading */
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
