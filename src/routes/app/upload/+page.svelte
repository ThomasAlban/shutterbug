<script>
	import { enhance } from '$app/forms';

	export let form;
	export let data;

	let theme = data.theme?.theme;
</script>

<a href="/app/home">Home</a>

<h1>Upload Image</h1>

theme: {theme} <br /> <br />

{#if form?.success}
	Upload successful!
{:else if data.alreadySubmitted}
	You have already submitted a photo for this theme.
{:else}
	<form method="post" action="?/upload" enctype="multipart/form-data" use:enhance>
		<input type="file" name="image" accept="image/*" required />
		<input type="submit" value="Upload" />
	</form>
	{#if form?.message}
		Upload failed - {form.message}
	{/if}
{/if}
