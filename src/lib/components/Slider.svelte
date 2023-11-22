<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';
	export let max: number = 100;

	export let height = '14rem';
	export let width = '11rem';
	export let outerBorderSize = '0.4rem';
	export let innerBorderSize = '0.15rem';

	export let color: 'orange' | 'purple' | 'green' = 'orange';

	export let editable = true;

	export let value: number = 50;
	let rangeControl: HTMLInputElement;
	onMount(() => {
		if (!editable) return;
		value = Number(rangeControl.value);
		rangeControl.addEventListener('input', (e) => (value = Number((e.target as HTMLInputElement).value)));
	});

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

	let gradColors: { gradZero: string; gradFifty: string; gradHundred: string };

	if (color === 'orange') gradColors = orangeColors;
	else if (color === 'purple') gradColors = purpleColors;
	else gradColors = greenColors;
</script>

<div
	class="slider-container"
	style="
        --height: {height}; 
        --width: {width}; 
        --value: {value}; 
        --max: {max}; 
        --outer-border-size: {outerBorderSize};
        --inner-border-size: {innerBorderSize};
        --grad-zero: {gradColors.gradZero};
        --grad-fifty: {gradColors.gradFifty};
        --grad-hundred: {gradColors.gradHundred};
    "
>
	{#if editable}
		<div class="input-container">
			<input
				id="range-control"
				type="range"
				class="vertical"
				orient="vertical"
				min="0"
				max="100"
				bind:this={rangeControl}
			/>
		</div>
	{/if}
	<div class="slider-visual-container">
		<div class="slider-visual" />
	</div>
</div>

<style>
	.slider-container {
		position: relative;
		height: var(--height);
		width: var(--width);
	}
	.input-container {
		z-index: 10;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}
	input {
		opacity: 0;
		appearance: slider-vertical;
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}
	.slider-visual-container {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		border: var(--outer-border-size) solid black;
		box-sizing: border-box;

		background: linear-gradient(45deg, var(--grad-zero) 0%, var(--grad-fifty) 50%, var(--grad-hundred) 100%);
	}
	.slider-visual {
		position: absolute;
		height: calc(100% - var(--value) / var(--max) * 100% - (var(--inner-border-size) * var(--value) / var(--max)));
		width: 100%;
		background: white;

		border-bottom: var(--inner-border-size) solid var(--grad-fifty);
	}
</style>
