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
			errorMsg={form?.message}
		/>
	</div>
	<p>
		Note: by uploading a photo you agree to the possibility of its use on the website homepage (randomly selected). You
		cannot delete submissions after the theme is over, but the submission may be removed by an admin if deemed
		inappropriate, which is at the admin's disgression.
	</p>
</div>

<style>
	.upload-widget {
		display: flex;
		justify-content: center;
		padding: 3rem;
	}
	p {
		--size: 0.9;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: 1.5;
	}
</style>
