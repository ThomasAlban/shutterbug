<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	export let success = false;
	// allows the user of the component to define custom success/error messages
	export let successMsg = 'Upload successful!';
	export let errorMsg: string | undefined = undefined;
	// function passed in which is called when the upload is successful
	export let successFn: VoidFunction = () => {};
	// show the preview either as a circle as a square
	export let previewShape: 'circle' | 'square' = 'square';

	let loading = false;

	let fileSelected = false;

	let input: HTMLInputElement;
	let imgSrc: string | null;

	let showImage = false;

	// this function is run when the input changes (i.e. a file is selected)
	function onChange() {
		// if there are no files return, else set 'file' to be the input file
		if (!input?.files) return;
		const file = input.files[0];

		if (file) {
			showImage = true;
			fileSelected = true;

			// read the file, and set the src of the preview image div to be this file
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				let result = reader.result;
				if (typeof result !== 'string') return;
				imgSrc = result;
			});
			reader.readAsDataURL(file);

			return;
		}
		showImage = false;
	}
</script>

<div class="upload-widget">
	<!-- if there is a preview, show the preview -->
	{#if imgSrc}
		<div class="photo {previewShape == 'circle' ? 'circle' : ''}" style="background-image: url({imgSrc});" />
	{/if}
	<!-- form responsible for receiving the image-->
	<form
		method="post"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance={() => {
			// set loading to true when the form is submitted
			loading = true;
			return (e) =>
				e.update().then(() => {
					// when the form returns, set loading to false and call the passed in function
					loading = false;
					successFn();
				});
		}}
	>
		<!-- the label is the part which will be styled to look like a button -->
		<label for="image-upload" id="image-upload-label" style={loading || success ? '' : 'cursor: pointer;'}>
			<!-- display the appropriate message -->
			{#if success}
				{successMsg}
			{:else if errorMsg}
				{errorMsg}
			{:else if fileSelected}
				Change image
			{:else}
				Choose image
			{/if}
		</label>
		<!-- this input will be hidden in the ui -->
		<input
			id="image-upload"
			type="file"
			name="image"
			accept="image/*"
			required
			bind:this={input}
			on:change={onChange}
			disabled={loading || success}
		/>
		{#if !success}
			<Button {loading} type="submit" disabled={!fileSelected}>Upload</Button>
		{/if}
	</form>
</div>

<style>
	/* overall container */
	.upload-widget {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
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
	/* image upload label, the visible part of the ui */
	#image-upload-label {
		--size: 1.75;
		--background-color: #fff;
		--text-color: var(--orange);

		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--size) * 1.4 * 1rem), calc(var(--size) * 1.4 * var(--rem-vw-ratio) * 1vw));

		text-decoration: none;
		font-family: 'Merriweather-BoldItalic';
		display: inline-block;

		/* rounded border */
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
	/* the preview photo, shown when the user selects an image for upload */
	.photo {
		border: 2px solid black;
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: cover;
		background-clip: border-box;
		background-position: center;
	}
	/* this class is activated if the previewShape is set to 'circle' */
	.circle {
		border-radius: 5000px;
	}
</style>
