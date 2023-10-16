<script>
	import { enhance } from '$app/forms';

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
		<form
			method="post"
			action="?/upload"
			enctype="multipart/form-data"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="file" name="image" accept="image/*" required />
			<input type="submit" value="Upload" />
		</form>
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
