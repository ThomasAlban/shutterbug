<script lang="ts">
	export let src: string;
	export let size = 50;
</script>

<img {src} alt="profile img" class="rounded" width={size} height={size} />

<style>
	img.rounded {
		object-fit: cover;
		border-radius: 50%;
	}
</style>
