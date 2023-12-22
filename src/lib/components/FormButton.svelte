<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	// variables which can be set by whoever uses this component
	// if they are set equal to something then they are optional
	export let action: string;
	export let size = 1.25;
	export let invertColor = false;
	export let useEnhance = true;
	export let method = 'post';

	// functions that the user of this component can pass in
	// 'fn' is called after the form returns but before the page is updated
	// 'fnPostUpdate' is called after the page updates
	export let fn: VoidFunction = () => {};
	export let fnPostUpdate: VoidFunction = () => {};

	// internal variable to keep track of whether the button is loading,
	// set to true when clicked and false when form returns
	let loading = false;
</script>

{#if useEnhance}
	<form
		{action}
		{method}
		use:enhance={() => {
			// this function runs when the form button is clicked
			// set loading to true
			loading = true;
			return (e) => {
				// when the form returns set loading to false and
				// call the first function the user may have passed in
				loading = false;
				fn();
				// wait for the page to update then call the second function
				e.update().then(fnPostUpdate);
			};
		}}
	>
		<!-- display the button, passing in all the props needed -->
		<Button {loading} {invertColor} {size} type="submit">
			<!-- slot anything in to the button that was slotted into this component -->
			<slot />
		</Button>
	</form>
{:else}
	<!-- similar to above, but does not use enhance and so does not set loading or call fn or fnPostUpdate -->
	<form {action} {method}>
		<Button {loading} {invertColor} {size} type="submit">
			<slot />
		</Button>
	</form>
{/if}
