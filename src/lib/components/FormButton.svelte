<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	export let action: string;

	export let size = 1.25;
	export let invertColor = false;
	export let useEnhance = true;
	export let method = 'post';

	let loading = false;

	export let fn: VoidFunction = () => {};
</script>

{#if useEnhance}
	<form
		{action}
		{method}
		use:enhance={() => {
			loading = true;
			return (e) => {
				// this used to be e.update().then(() => {...}) but this caused issues so I've now put loading=false and fn() before e.update() to see if it fixes them
				loading = false;
				fn();
				e.update();
			};
		}}
	>
		<Button {loading} {invertColor} {size} type="submit">
			<slot />
		</Button>
	</form>
{:else}
	<form {action} {method}>
		<Button {loading} {invertColor} {size} type="submit">
			<slot />
		</Button>
	</form>
{/if}
