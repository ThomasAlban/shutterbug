<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	export let success = false;
	export let successMsg = 'Upload successful!';
	export let successFn: VoidFunction = () => {};
	export let errorMsg: string | undefined = undefined;

	let loading = false;

	let fileSelected = false;

	let imageUpload: HTMLInputElement;
	$: if (imageUpload)
		imageUpload.onchange = () => {
			const fileName = imageUpload.files?.item(0)?.name;
			if (fileName) fileSelected = true;
		};
</script>

<div class="upload-widget">
	<form
		method="post"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return (e) =>
				e.update().then(() => {
					loading = false;
					successFn();
				});
		}}
	>
		<label for="image-upload" id="image-upload-label" style={loading || success ? '' : 'cursor: pointer;'}>
			{#if success}
				{successMsg}
			{:else if errorMsg}
				{errorMsg}
			{:else if fileSelected}
				File selected!
			{:else}
				Choose image
			{/if}
		</label>
		<input
			id="image-upload"
			type="file"
			name="image"
			accept="image/*"
			required
			bind:this={imageUpload}
			disabled={loading || success}
		/>
		{#if !success}
			<Button {loading} type="submit" disabled={!fileSelected}>Upload</Button>
		{/if}
	</form>
</div>

<style>
	form {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0;
	}

	input[type='file'] {
		/* done this instead of setting display to none so you can still tab to the element */
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap; /* 1 */
		clip-path: inset(50%);
		border: 0;
	}
	#image-upload-label {
		--size: 1.75;
		--background-color: #fff;
		--text-color: var(--orange);

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

	form {
		display: flex;
		gap: 1rem;
	}
</style>
