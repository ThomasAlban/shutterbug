<script lang="ts">
	import VoteSliders from './VoteSliders.svelte';

	export let data;
	$: ({ friendsWithSubmissions } = data);

	let voteSliderValues: {
		humour: number;
		creativity: number;
		photography: number;
	};
</script>

<div class="votes-container">
	{#each friendsWithSubmissions as user}
		{#if user.photoSubmission}
			<div class="photo" style="background-image: url({user.photoSubmission});" />
		{/if}
	{:else}
		There are no submissions.
	{/each}
</div>

<div class="sliders-container">
	<VoteSliders bind:values={voteSliderValues} />
</div>

<style>
	* {
		--sliders-height: 12rem;
	}
	:root {
		overflow: hidden;
	}
	.votes-container {
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));

		overflow: scroll;
		scroll-snap-type: y mandatory;
	}
	.photo {
		scroll-snap-align: start;
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));

		background-repeat: no-repeat;
		background-size: cover;
		background-clip: border-box;
		background-position: center;
	}
	.sliders-container {
		height: 12rem;
		position: fixed;
		bottom: var(--navbar-bottom-height);
		margin-left: auto;
		margin-right: auto;
		width: min(100%, 50rem);
		background-color: blue;
	}
</style>
