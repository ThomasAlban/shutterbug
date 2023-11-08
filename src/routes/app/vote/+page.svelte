<script lang="ts">
	import { onMount } from 'svelte';
	import VoteSliders from './VoteSliders.svelte';
	import Button from '$lib/components/Button.svelte';

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

	$: currentPhotoIndex = (scrollTop / scrollHeight) * (friendsWithSubmissions.length + 1);
	$: currentPhotoIndexFloor = Math.floor(currentPhotoIndex);

	$: onExactPhoto = Math.abs(currentPhotoIndex - currentPhotoIndexFloor) < 0.01;

	let votes: { humour: number; creativity: number; photography: number }[] = [];

	const updateVoteSliderValues = () => (voteSliderValues = votes[currentPhotoIndexFloor]);
	const updateVotesCurrentIndex = () => (votes[currentPhotoIndexFloor] = voteSliderValues);

	$: currentPhotoIndexFloor, onExactPhoto && votes[currentPhotoIndex] && updateVoteSliderValues();
	$: voteSliderValues, onExactPhoto && votes[currentPhotoIndex] && updateVotesCurrentIndex();

	const lerp = (a: number, b: number, alpha: number) => a + alpha * (b - a);

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

	let slidersOffset = 0;

	$: if (currentPhotoIndex > votes.length - 1) {
		slidersOffset = currentPhotoIndex - votes.length + 1;
	} else {
		slidersOffset = 0;
	}
	$: console.log(slidersOffset);
</script>

<div class="votes-container" bind:this={votesContainer}>
	{#each friendsWithSubmissions as user}
		<div class="photo" style="background-image: url({user.photoSubmission});" />
	{/each}
	<div class="submit-message">
		<h2>You've voted on all the submissions!</h2>
	</div>
</div>

<div class="sliders-container" style="--sliders-offset: {slidersOffset};">
	<div class="vote-sliders">
		{#if currentPhotoIndex != null}
			<VoteSliders bind:values={voteSliderValues} />
		{/if}
	</div>
	<div class="submit-btn-container">
		<Button invertColor={true}>Submit</Button>
	</div>
</div>

<style>
	* {
		--sliders-height: 12rem;
	}
	.votes-container {
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));

		overflow-y: scroll;
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
	.submit-message {
		scroll-snap-align: start;
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));
		background-color: var(--orange);
		color: white;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.sliders-container {
		height: var(--sliders-height);
		position: fixed;
		bottom: var(--navbar-bottom-height);
		margin-left: auto;
		margin-right: auto;
		width: min(100%, 50rem);
		background-color: black;
	}
	.vote-sliders {
		position: relative;
		bottom: calc(var(--sliders-offset) * var(--sliders-height) * -1);
		z-index: 2;
	}
	.submit-btn-container {
		z-index: 1;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
