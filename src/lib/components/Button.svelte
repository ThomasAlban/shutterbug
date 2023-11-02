<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

	export let invertColor = false;
	export let link: string | undefined = undefined;
	export let loading = false;
	export let disabled = false;

	export let size = 1.75;

	let width: number | undefined = undefined;
	let height: number | undefined = undefined;

	let slot: HTMLDivElement | undefined;

	$: if (slot) {
		width = slot.clientWidth;
		height = slot.clientHeight;
	}
</script>

<div
	class="button-wrapper"
	style="
        --background-color: {invertColor ? '#fff' : 'var(--orange)'}; 
        --text-color: {invertColor ? 'var(--orange)' : '#fff'};
        --size: {size};
        line-height: 1;
    "
>
	{#if link}
		<a on:click class="btn" href={link} style="cursor: pointer;">
			<slot />
		</a>
	{:else}
		<button
			on:click
			disabled={loading || disabled}
			class="btn"
			{type}
			style={loading || disabled ? '' : 'cursor: pointer;'}
		>
			{#if loading}
				<div class="spinner-container" style={width && height ? `width: ${width}px; height: ${height}px` : ''}>
					<div class="loading-spinner" />
				</div>
			{:else}
				<div id="slot" bind:this={slot}>
					<slot />
				</div>
			{/if}
		</button>
	{/if}
</div>

<style>
	.spinner-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn {
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--size) * 1.4 * 1rem), calc(var(--size) * 1.4 * var(--rem-vw-ratio) * 1vw));

		text-decoration: none;
		font-family: 'Merriweather-BoldItalic';
		display: inline-block;

		border-radius: 500px;

		border: 1px solid transparent;
		letter-spacing: 0.05rem;
		text-align: center;

		color: var(--text-color);
		background-color: var(--background-color);

		box-shadow: 0 calc(var(--size) * 0.2rem) calc(var(--size) * 0.3rem) 1px rgb(50, 50, 50);

		padding: 0.2rem 1rem 0.2rem 1rem;
	}

	.loading-spinner {
		height: 1em;
		width: 1em;
		border-color: var(--text-color) transparent var(--text-color) var(--text-color);
		border-width: calc(1em / 8);
		border-style: solid;
		border-image: initial;
		box-sizing: border-box;
		border-radius: 100%;
		animation: 0.75s linear 0s infinite normal none running rotate;
		margin: 0;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
