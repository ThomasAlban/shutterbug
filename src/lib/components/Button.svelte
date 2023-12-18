<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

	// various customisation options for the button
	export let invertColor = false;
	// the bnutton can act both as a button and a link (a tag)
	export let link: string | undefined = undefined;
	export let loading = false;
	export let disabled = false;

	export let size = 1.75;

	let width: number | undefined = undefined;
	let height: number | undefined = undefined;

	let slot: HTMLDivElement | undefined;

	// save the width and height of the button so that when we are loading we can retain the button's
	// width and height even though the loading spinner will be smaller than that
	$: if (slot) {
		width = slot.clientWidth;
		height = slot.clientHeight;
	}
</script>

<!-- here we pass variables from javascript to css so they can be used to style the button accordingly -->
<div
	class="button-wrapper"
	style="
        --background-color: {invertColor ? '#fff' : 'var(--orange)'}; 
        --text-color: {invertColor ? 'var(--orange)' : '#fff'};
        --size: {size};
        line-height: 1;
        display: flex;
        justify-content: center
    "
>
	{#if link}
		<!-- if we have provided a link then the button needs to be an a tag -->
		<a on:click class="btn" href={link} style="cursor: pointer;">
			<slot />
		</a>
	{:else}
		<!-- otherwise the button needs to be a button -->
		<button
			on:click
			disabled={loading || disabled}
			class="btn"
			{type}
			style={loading || disabled ? '' : 'cursor: pointer;'}
		>
			{#if loading}
				<!-- display the loading spinner if we are loading -->
				<div class="spinner-container" style={width && height ? `width: ${width}px; height: ${height}px` : ''}>
					<div class="loading-spinner" />
				</div>
			{:else}
				<div class="slot" bind:this={slot}>
					<!-- if we are not loading, slot any sub components in here -->
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

		/* make the button fully rounded */
		border-radius: 500px;

		border: 1px solid transparent;
		letter-spacing: 0.05rem;
		text-align: center;

		color: var(--text-color);
		background-color: var(--background-color);

		box-shadow: 0 calc(var(--size) * 0.2rem) calc(var(--size) * 0.3rem) 1px rgb(50, 50, 50);

		padding: 0.2rem 1rem 0.2rem 1rem;
	}

	/* a loading spinner class that is displayed when 'loading' is set to true */
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

	/* rotates the loading spinner */
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	/* make sure any slotted items are center aligned */
	.slot {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
