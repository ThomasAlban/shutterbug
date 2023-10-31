<script lang="ts">
</script>

<label for="image-upload" class="image-upload-label">Choose Image</label>
<input id="image-upload" type="file" name="image" accept="image/*" required />

<style>
	input[type='file'] {
		display: none;
	}
	.image-upload-label {
		border: 1px solid #ccc;
		display: inline-block;
		padding: 6px 12px;
		cursor: pointer;
	}
</style>
