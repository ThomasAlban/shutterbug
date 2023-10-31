<script>
	import { enhance } from '$app/forms';
	import UploadWidget from '$lib/components/UploadWidget.svelte';

	export let form;
	export let data;

	$: ({ currentTheme } = data);
</script>

<div class="wrapper">
	<a href="/app/home">Home</a>

	<h1>Upload Image</h1>

	theme: {currentTheme.theme} <br /> <br />

	{#if form?.success}
		Upload successful!
	{:else if data.alreadySubmitted}
		You have already submitted a photo for this theme.
	{:else}
		<UploadWidget>Upload</UploadWidget>
		{#if form?.message}
			Upload failed - {form.message}
		{/if}
	{/if}
</div>

<style>
	.wrapper {
		background-color: white;
	}
</style>
