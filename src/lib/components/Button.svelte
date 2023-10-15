<script lang="ts">
	import Loading from './Loading.svelte';
	import '$lib/style.css';
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let fontSize = 40;
	export let invertColor = false;
	export let link: string | undefined = undefined;
	export let loading = false;
	export let width: number | undefined = undefined;

	let backgroundColor = '#e27d00';
	let textColor = '#fff';

	if (invertColor) [backgroundColor, textColor] = [textColor, backgroundColor];
</script>

<div class="button-wrapper">
	{#if link}
		<a
			class="btn btnhover"
			href={link}
			style="--font-size: {fontSize}rem; --background-color: {backgroundColor}; --text-color: {textColor}"
		>
			<slot />
		</a>
	{:else if loading}
		<button
			disabled
			class="btn"
			{type}
			style="--font-size: {fontSize}rem; --background-color: {backgroundColor}; --text-color: {textColor}; --width: {width}rem"
		>
			<div class="center">
				<Loading size={fontSize} color={textColor} />
			</div>
		</button>
	{:else}
		<button
			class="btn btnhover"
			{type}
			style="--font-size: {fontSize}rem; --background-color: {backgroundColor}; --text-color: {textColor}; --width: {width}rem"
		>
			<slot />
		</button>
	{/if}
</div>

<style>
	.button-wrapper {
		line-height: 1;
	}

	.btn {
		width: var(--width);
		text-decoration: none;
		font-family: 'Merriweather-BoldItalic';
		display: inline-block;
		font-size: var(--font-size);
		line-height: 1;
		border-radius: 500px;
		transition-property: background-color, border-color, color, box-shadow, filter;
		transition-duration: 0.3s;
		border: 1px solid transparent;
		letter-spacing: 1px;
		text-align: center;

		--padding-amount: calc(var(--font-size) / 3);
		padding: var(--padding-amount);

		color: var(--text-color);
		background-color: var(--background-color);

		--shadow-h-offset: calc(var(--font-size) / 8);
		--shadow-blur: calc(var(--font-size) / 5);
		box-shadow: 0px var(--shadow-h-offset) var(--shadow-blur) 1px rgb(90, 90, 90);
	}
	.btnhover {
		cursor: pointer;
	}
</style>
