<script lang="ts">
	import { onMount } from 'svelte';
	import VoteSliders from './VoteSliders.svelte';

	export let data;
	$: ({ friendsWithSubmissions } = data);

	let voteSliderValues: {
		humour: number;
		creativity: number;
		photography: number;
	};

	let votesContainer: HTMLDivElement;
	let scrollTop: number;
	let scrollHeight: number;

	onMount(() => {
		votesContainer.addEventListener('scroll', (e) => {
			scrollTop = votesContainer.scrollTop;
			scrollHeight = votesContainer.scrollHeight;
		});
		for (let i = 0; i < friendsWithSubmissions?.length; i++) {
			votes.push({ humour: 50, creativity: 50, photography: 50 });
		}
	});

	let currentPhotoIndex: number = -1;
	$: currentPhotoIndex = (scrollTop / scrollHeight) * friendsWithSubmissions.length;
	$: currentPhotoIndexFloor = Math.floor(currentPhotoIndex);

	let votes: { humour: number; creativity: number; photography: number }[] = [];

	const updateVoteSliderValues = () => (voteSliderValues = votes[currentPhotoIndexFloor]);
	const updateVotesCurrentIndex = () => (votes[currentPhotoIndexFloor] = voteSliderValues);

	$: currentPhotoIndexFloor, currentPhotoIndex == currentPhotoIndexFloor && updateVoteSliderValues();
	$: voteSliderValues, currentPhotoIndex == currentPhotoIndexFloor && updateVotesCurrentIndex();

	function lerp(a: number, b: number, alpha: number) {
		return a + alpha * (b - a);
	}

	$: if (
		currentPhotoIndex != currentPhotoIndexFloor &&
		voteSliderValues?.humour &&
		votes[currentPhotoIndexFloor] &&
		votes[currentPhotoIndexFloor + 1]
	) {
		let amountScrolled = currentPhotoIndex - currentPhotoIndexFloor;
		let voteBefore = votes[currentPhotoIndexFloor];
		let voteAfter = votes[currentPhotoIndexFloor + 1];
		voteSliderValues = {
			humour: lerp(voteBefore.humour, voteAfter.humour, amountScrolled),
			creativity: lerp(voteBefore.creativity, voteAfter.creativity, amountScrolled),
			photography: lerp(voteBefore.photography, voteAfter.photography, amountScrolled)
		};
	}
</script>

<div class="votes-container" bind:this={votesContainer}>
	{#each friendsWithSubmissions as user}
		<div class="photo" style="background-image: url({user.photoSubmission});" />
	{:else}
		There are no submissions.
	{/each}
</div>

<div class="sliders-container">
	{#if currentPhotoIndex != null}
		<VoteSliders bind:values={voteSliderValues} />
	{/if}
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
