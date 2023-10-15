<script lang="ts">
	export let url: string | null;
	// this splits up the URL into an array containing each part seperated by a '/'
	// then inserts an 'e_blur' url parameter so that cloudinary returns a blurred version of the img
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

<div class="background" style="--url: url({url})">
	<div class="blur">
		<slot />
	</div>
</div>

<style>
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
	}
	.blur {
		backdrop-filter: blur(10px) brightness(75%);
		-webkit-backdrop-filter: blur(10px) brightness(75%);
		width: 100%;
		height: 100%;
		padding: 3rem;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
