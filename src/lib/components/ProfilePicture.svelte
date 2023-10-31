<script lang="ts">
	export let src: string | null;
	export let size = 1;
</script>

<img src={src ?? '/user-icon.jpg'} alt="profile img" style="width: {size}em; height: {size}em" />

<style>
	img {
		object-fit: cover;
		border-radius: 50%;
		border: 1px solid black;
	}
</style>
