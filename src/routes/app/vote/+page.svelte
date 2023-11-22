<script lang="ts">
	import { onMount } from 'svelte';
	import VoteSliders from './VoteSliders.svelte';

	import FormButton from '$lib/components/FormButton.svelte';
	import { toasts } from 'svelte-toasts';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import UserWidget from '$lib/components/UserWidget.svelte';
	import type { ClientUser } from '$lib/server/db';

	export let data;
	export let form;
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
		votesContainer.addEventListener('scroll', (_) => {
			scrollTop = votesContainer.scrollTop;
			scrollHeight = votesContainer.scrollHeight;
		});

		for (const friend of friendsWithSubmissions) {
			votes.push({ userID: friend.user.userID, humour: 50, creativity: 50, photography: 50 });
		}
	});

	let currentPhotoIndex: number = -1;

	$: currentPhotoIndex = (scrollTop / scrollHeight) * (friendsWithSubmissions.length + 1);
	$: if (isNaN(currentPhotoIndex)) currentPhotoIndex = 0;
	$: currentPhotoIndexFloor = Math.floor(currentPhotoIndex);

	$: onExactPhoto = Math.abs(currentPhotoIndex - currentPhotoIndexFloor) < 0.01;

	let votes: { userID: string; humour: number; creativity: number; photography: number }[] = [];
	let JSONVotesString: string;
	$: JSONVotesString = JSON.stringify(votes);

	const updateVoteSliderValues = () => {
		voteSliderValues = votes[currentPhotoIndexFloor];
	};
	const updateVotesCurrentIndex = () => {
		votes[currentPhotoIndexFloor].humour = voteSliderValues.humour;
		votes[currentPhotoIndexFloor].creativity = voteSliderValues.creativity;
		votes[currentPhotoIndexFloor].photography = voteSliderValues.photography;
	};

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

	$: if (form?.voteSuccess) {
		toasts.success({ title: 'Successfully submitted votes', description: '' });
		goto('/app/home');
	}
	let currentUser: ClientUser | null;
	$: currentUser = data.friendsWithSubmissions[currentPhotoIndexFloor]?.user;
</script>

<div class="upper-info-container" style="opacity: {(1 - slidersOffset) * 100}%">
	<div class="info-item-left-align">
		{#if currentUser}
			<UserWidget user={currentUser} friendStatus="friends" showButtons={false} size={1.5} maxAllowedWidth={200} />
		{/if}
	</div>
	<div class="info-item-right-align">
		<Button invertColor={true} disabled={true} size={1.5}>{data.previousTheme.theme}</Button>
	</div>
</div>

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
		{#if friendsWithSubmissions.length > 0}
			<FormButton action="?/vote&votes={JSONVotesString}" invertColor={true} size={3}>Submit</FormButton>
		{:else}
			<Button link="/app/home" invertColor={true} size={3}>Go Home</Button>
		{/if}
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
		width: min(100%, var(--max-app-width));
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
	.upper-info-container {
		height: 5rem;
		position: absolute;
		top: var(--navbar-top-height);

		width: min(100%, var(--max-app-width));
		z-index: 1;

		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}
	.info-item-left-align {
		padding-left: 0.5rem;
		display: flex;
		justify-content: left;
		align-items: center;
	}
	.info-item-right-align {
		padding-right: 0.5rem;
		display: flex;
		justify-content: right;
		align-items: center;
	}
</style>
