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

	// stores the values of the actual sliders
	let voteSliderValues: {
		humour: number;
		creativity: number;
		photography: number;
	};
	// stores the values of each vote
	let votes: { userID: string; humour: number; creativity: number; photography: number }[] = [];

	let votesContainer: HTMLDivElement;

	// these store the total scroll distance of the page and where we are currentlty scrolled
	let scrollTop: number;
	let scrollHeight: number;

	// this will store which photo we are currently looking at
	// set to -1 meaning no photo to start with
	let currentPhotoIndex: number = -1;

	// on mount, add an event listener to set the scrollTop and scrollHeight values
	// and set the votes array to defaults of 50
	onMount(() => {
		votesContainer.addEventListener('scroll', (_) => {
			scrollTop = votesContainer.scrollTop;
			scrollHeight = votesContainer.scrollHeight;
		});
		for (const friend of friendsWithSubmissions) {
			votes.push({ userID: friend.user.userID, humour: 50, creativity: 50, photography: 50 });
		}
	});

	// work out which photo we are currently on based on the ratio of
	// where we are scrolled on the page and the number of submissions
	// (may not be a whole number)
	$: currentPhotoIndex = (scrollTop / scrollHeight) * (friendsWithSubmissions.length + 1);
	// fail safe so that it is set to 0 if not a number
	$: if (isNaN(currentPhotoIndex)) currentPhotoIndex = 0;
	// this stores the floor (rounded down) version of the currentPhotoIndex
	$: currentPhotoIndexFloor = Math.floor(currentPhotoIndex);

	// this boolean stores whether or not we are exactly on a photo, based on the difference between
	// the currentPhotoIndex and the rounded version of this value being small enough
	$: onExactPhoto = Math.abs(currentPhotoIndex - currentPhotoIndexFloor) < 0.01;

	// this is used when we send the votes off to the backend of the app to be submitted
	let JSONVotesString: string;
	$: JSONVotesString = JSON.stringify(votes);

	// functions to update the sliders to what vote we are currently looking at, and set the vote values
	// of what we are currently looking at to the sliders
	// (the opposite of each other)
	const updateVoteSliderValues = () => {
		voteSliderValues = votes[currentPhotoIndexFloor];
	};
	const updateVotesCurrentIndex = () => {
		votes[currentPhotoIndexFloor].humour = voteSliderValues.humour;
		votes[currentPhotoIndexFloor].creativity = voteSliderValues.creativity;
		votes[currentPhotoIndexFloor].photography = voteSliderValues.photography;
	};

	// when we scroll onto another submission, update the sliders to match what vote we are on
	$: currentPhotoIndexFloor, onExactPhoto && votes[currentPhotoIndex] && updateVoteSliderValues();

	// when we change the sliders and are on an exact photo, update the vote to match the sliders
	$: voteSliderValues, onExactPhoto && votes[currentPhotoIndex] && updateVotesCurrentIndex();

	// linear interpolate function (smoothly transition between 2 numbers)
	const lerp = (a: number, b: number, alpha: number) => a + alpha * (b - a);

	// if we are not on an exact photo then linear interpolate between the 2 vote values to create
	// a smooth scroll transition effect
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

	// if we reach the end of the submissions, then transision the slidersOffset variable from 0 to 1
	// so that the sliders will drop down in the UI
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

	// get information about the current user
	let currentUser: ClientUser | null;
	$: currentUser = data.friendsWithSubmissions[currentPhotoIndexFloor]?.user;
</script>

<div id="noscroll" />

<!-- contains the user widget and the theme widget -->
<!-- fades away when we reach the end of the submissions -->
<div class="upper-info-container" style="opacity: {(1 - slidersOffset) * 100}%">
	<div class="info-item-left-align">
		<!-- display the current user using the UserWidget component -->
		{#if currentUser}
			{#key currentUser.username}
				<UserWidget
					user={currentUser}
					friendStatus="friends"
					showButtons={false}
					size={1.5}
					maxWidthRem={14.5}
					maxWidthVW={50}
				/>
			{/key}
		{/if}
	</div>
	<!-- display the theme widget, using a disabled button -->
	<div class="info-item-right-align">
		<Button invertColor={true} disabled={true} size={1.5}>{data.previousTheme.theme}</Button>
	</div>
</div>

<!-- container which stores all the votes which are scrolled between -->
<div class="votes-container" bind:this={votesContainer}>
	<!-- display each submission -->
	{#each friendsWithSubmissions as user}
		<div class="photo" style="background-image: url({user.photoSubmission});" />
	{/each}
	<div class="submit-message">
		<h2>You've voted on all the submissions!</h2>
	</div>
</div>

<!-- display the sliders and beneath them, the submit button -->
<!-- this will be revealed when the sliders drop down at the end of the submissions -->
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
	/* container of each submission to be voted on */
	.votes-container {
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));

		/* set this to be a scrollable container */
		overflow-y: scroll;
		/* magnetic scrolling */
		scroll-snap-type: y mandatory;
	}
	/* each photo submission to be voted on */
	.photo {
		/* each photo should snap the scrolling to stop at the top of the photo */
		scroll-snap-align: start;
		height: calc(100dvh - var(--navbar-top-height) - var(--navbar-bottom-height) - var(--sliders-height));

		/* make the image centered and as large as possible in the photo div */
		background-repeat: no-repeat;
		background-size: cover;
		background-clip: border-box;
		background-position: center;
	}
	/* the submit message shown at the end of the submissions */
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
	/* the container for the vote sliders and the submit button */
	.sliders-container {
		height: var(--sliders-height);
		position: fixed;
		bottom: var(--navbar-bottom-height);
		margin-left: auto;
		margin-right: auto;
		width: min(100%, var(--max-app-width));
		background-color: black;
	}
	/* container for the vote sliders */
	.vote-sliders {
		position: relative;
		bottom: calc(var(--sliders-offset) * var(--sliders-height) * -1);
		/* display above the submit button */
		z-index: 2;
	}
	/* container for the submit button */
	.submit-btn-container {
		z-index: 1;
		position: absolute;
		/* center the button */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	/* container for the theme info and the user widget */
	.upper-info-container {
		height: 5rem;
		position: absolute;
		top: var(--navbar-top-height);

		width: min(100%, var(--max-app-width));
		z-index: 1;

		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}
	/* user widget container */
	.info-item-left-align {
		padding-left: 0.5rem;
		display: flex;
		justify-content: left;
		align-items: center;
	}
	/* theme info container */
	.info-item-right-align {
		padding-right: 0.5rem;
		display: flex;
		justify-content: right;
		align-items: center;
	}
</style>
