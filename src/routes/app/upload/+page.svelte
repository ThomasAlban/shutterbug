<script>
	export let form;
	export let data;

	let theme = data.theme?.theme;
</script>

<h1>Upload Image</h1>

theme: {theme} <br /> <br />

{#if form?.success}
	Upload successful!
{:else}
	<form method="post" action="?/upload" enctype="multipart/form-data">
		<input type="file" name="image" accept="image/*" />
		<input type="submit" value="Upload" />
	</form>
	{#if form?.message}
		Upload failed - {form.message}
	{/if}
{/if}
