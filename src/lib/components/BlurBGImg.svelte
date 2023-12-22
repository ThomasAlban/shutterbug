<script lang="ts">
	export let url: string | null;
	export let centerContents = true;
	// this splits up the URL into an array containing each part seperated by a '/'
	// then inserts url parameters to make cloudinary return a low quality version of the image
	// (we don't need high quality as it will be blurred anyway)
	// then puts the url back together into a string with '/' dividing each part of the url
	if (url == null) {
		url = '';
	} else {
		let urlArr = url.split('/');
		let uploadIx = urlArr.findIndex((e) => e === 'upload');
		urlArr.splice(uploadIx + 1, 0, 'w_75,q_auto:eco,f_auto');
		url = urlArr.join('/');
	}
</script>

<!-- displaying a blurred background image requires 2 divs - background, and blur -->
<!-- pass in the url as a css variable to the background div -->
<div class="background" style="--url: url({url})">
	<!-- add the 'center-contents' class to this div if the prop is set to true -->
	<div class="blur {centerContents ? 'center-contents' : ''}">
		<slot />
	</div>
</div>

<style>
	/* background div is responsible for displaying the image itself */
	.background {
		height: 100%;
		background-image: var(--url);
		background-color: black;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%;
		color: white;
		line-height: 2rem;
		overflow: hidden;
		display: flex;
		flex: 1 1 auto;
	}
	/* blur is overlayed on top and is responsible for blurring the image */
	.blur {
		backdrop-filter: blur(10px) brightness(75%);
		width: 100%;
		/* padding: 3rem; */
		box-sizing: border-box;
	}
	.center-contents {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
