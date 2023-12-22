<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';
	// max value of the slider
	export let max: number = 100;

	// props for the slider dimensions
	export let height = '14rem';
	export let width = '11rem';
	export let outerBorderSize = '0.4rem';
	export let innerBorderSize = '0.15rem';

	export let color: 'orange' | 'purple' | 'green' = 'orange';

	// if true, the slider will be editable, if false, it will only display the value
	export let editable = true;

	export let value: number = 50;

	let rangeControl: HTMLInputElement;

	// if the slider is editable, set an event listener to track the range control's value
	// and set it to the value variable
	onMount(() => {
		if (!editable) return;
		value = Number(rangeControl.value);
		rangeControl.addEventListener('input', (e) => (value = Number((e.target as HTMLInputElement).value)));
	});

	// preset colours for the slider
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

	// this stores the actual colours which will be used
	// it is set by the 3 possibilities above
	let gradColors: { gradZero: string; gradFifty: string; gradHundred: string };

	// set gradColors to whatever colours it needs to be
	if (color === 'orange') gradColors = orangeColors;
	else if (color === 'purple') gradColors = purpleColors;
	else gradColors = greenColors;
</script>

<!-- pass in variables above as css variables -->
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
		<!-- this div contains an input type range which is what the user actually interacts with to edit the slider -->
		<!-- although it is hidden from view -->
		<!-- this only exists if the slider is 'editable' -->
		<div class="input-container">
			<input type="range" min="0" max="100" bind:this={rangeControl} />
		</div>
	{/if}
	<!-- this displays the visual element of the slider -->
	<div class="slider-visual-container">
		<div class="slider-visual" />
	</div>
</div>

<style>
	/* container for the whole slider */
	.slider-container {
		overflow: hidden;
		position: relative;
		height: var(--height);
		width: var(--width);
	}
	/* contains the hidden but interactable input */
	.input-container {
		/* display it above everything else */
		z-index: 10;
		/* set its opacity to 0 to hide it */
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
		container-type: size;
	}

	/* style the hidden but interactable input */
	input[type='range'] {
		z-index: 10;
		/* remove default appearance */
		appearance: none;

		position: absolute;
		top: 50%;
		left: 50%;
		padding: 0;
		margin: 0;
		cursor: pointer;

		/* set the slider's height to be 100% of the container's width */
		height: 100cqw;
		/* set the slider's width to be 100% of the container's height */
		width: 100cqh;

		/* transform the slider so that it is centered and */
		/* rotate it so that it is vertical rather than horizontal */
		transform: translate(-50%, -50%) rotate(270deg);

		/* make the hitbox of the slider thumb bigger so that it's not so finicky on mobile devices */
		/* using webkit and moz styling seperately because there is not a unified standard for range input */
		&::-webkit-slider-thumb {
			transform: scale(7, 10);
		}
		&::-moz-range-thumb {
			transform: scale(7, 10);
		}
	}
	/* if the container's smaller, make the hitbox smaller so it doesn't overlap outside of itself */
	@container (max-width: 10rem) {
		input[type='range']::-webkit-slider-thumb {
			transform: scale(5, 6);
		}
		input[type='range']::-moz-range-thumb {
			transform: scale(5, 6);
		}
	}

	/* container for the visual element of the slider */
	/* this is the gradient which is set to the colours defined above */
	/* although the moving part of the slider appears to be the gradient, it is in fact the white part that moves */
	/* this is so that the gradient is not warped as the slider moves up and down */
	.slider-visual-container {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		/* set the border */
		border: var(--outer-border-size) solid black;
		box-sizing: border-box;

		/* set the background to be the gradient */
		background: linear-gradient(45deg, var(--grad-zero) 0%, var(--grad-fifty) 50%, var(--grad-hundred) 100%);
	}
	/* this is the moving part of the visual slider */
	.slider-visual {
		position: absolute;
		/* set the height to be the inverse of the value of the slider, 
        so that it appears as though the gradient part is the slider */
		/* also adjust for the border size */
		height: calc(100% - var(--value) / var(--max) * 100% - (var(--inner-border-size) * var(--value) / var(--max)));
		width: 100%;
		background: white;

		border-bottom: var(--inner-border-size) solid var(--grad-fifty);
	}
</style>
