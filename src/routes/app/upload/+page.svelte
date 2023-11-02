<script>
	import UploadWidget from '$lib/components/UploadWidget.svelte';

	export let form;
	export let data;

	$: ({ currentTheme } = data);
</script>

<div class="wrapper">
	<div class="orange">
		<h1>Submit photo</h1>
		<p>The current theme is:</p>
		<h2>{currentTheme.theme}</h2>
	</div>

	<div class="upload-widget">
		<UploadWidget
			success={form?.success || data.alreadySubmitted}
			successMsg="Photo submitted!"
			errorMsg={form?.message}>Upload</UploadWidget
		>
	</div>
</div>

<style>
	.upload-widget {
		display: flex;
		justify-content: center;
		padding: 3rem;
	}
</style>
