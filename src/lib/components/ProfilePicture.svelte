<script lang="ts">
	export let src: string | null;
	export let size = 1;
	export let imgWidth = 75;

	if (src) {
		// split the url and add url parameters so that the image is sent back from cloudinary at the specified width
		let urlArr = src.split('/');
		let uploadIx = urlArr.findIndex((e) => e === 'upload');
		urlArr.splice(uploadIx + 1, 0, `w_${imgWidth},q_auto:good,f_auto`);
		src = urlArr.join('/');
	}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<img src={src ?? '/user-icon.jpg'} style="width: {size}em; height: {size}em" />

<style>
	img {
		object-fit: cover;
		/* make it into a circle */
		border-radius: 50%;
		border: 1px solid black;
		/* fallback if the image hasn't loaded yet */
		background-color: grey;
	}
</style>
