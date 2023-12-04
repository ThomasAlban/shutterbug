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
	.sliders-container {
		overflow: hidden;
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
