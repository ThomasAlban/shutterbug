<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	export let action: string;

	export let size = 1.25;
	export let invertColor = false;

	let loading = false;

	export let fn: VoidFunction = () => {};
</script>

<form
	{action}
	method="post"
	use:enhance={() => {
		loading = true;
		return (e) =>
			e.update().then(() => {
				loading = false;
				fn();
			});
	}}
>
	<Button {loading} {invertColor} {size} type="submit">
		<slot />
	</Button>
</form>
