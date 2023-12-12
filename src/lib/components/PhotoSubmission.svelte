<script lang="ts">
	import type { Photo, Theme } from '@prisma/client';
	import Slider from '$lib/components/Slider.svelte';
	import Button from '$lib/components/Button.svelte';

	export let photoSubmission: {
		photo: Photo;
		theme: Theme;
		overallVote: {
			humour: number;
			creativity: number;
			photography: number;
			votes: number;
		} | null;
	};

	// add cloudinary url params
	let urlArr = photoSubmission.photo.photo.split('/');
	let uploadIx = urlArr.findIndex((e) => e === 'upload');
	urlArr.splice(uploadIx + 1, 0, 'w_750,q_auto:good,f_auto');
	photoSubmission.photo.photo = urlArr.join('/');

	const borderSize = '0.4rem';

	export let slidersHeight = 'min(12rem, calc(var(--rem-vw-ratio) * 12vw))';

	let width: number;
</script>

<div class="wrapper" bind:clientWidth={width} style="--width: {width}px">
	<div class="info-container">
		<Button disabled={true} size={1.2} invertColor={true}>
			{photoSubmission.photo.dateCreated.toLocaleDateString()}
		</Button>
		<Button disabled={true} size={1.2} invertColor={true}>{photoSubmission.theme.theme}</Button>
	</div>
	<div class="photo-submission-container">
		<div class="photo" style="background-image: url({photoSubmission.photo.photo});" />
		<div class="photo-submission-loading-text"><h3>Loading photo...</h3></div>
	</div>

	{#if photoSubmission.overallVote}
		<div class="vote-text-container">
			<p class="vote-text">
				{photoSubmission.overallVote.votes} votes &nbsp·&nbsp overall score:
			</p>
		</div>
		<div class="sliders-container" style="--border-size: {borderSize}; --sliders-height: {slidersHeight};">
			<div class="slider-container">
				<div class="slider-text-container">
					<p class="slider-text">Humour</p>
				</div>
				<Slider
					color="orange"
					width="100%"
					height="100%"
					outerBorderSize={borderSize}
					value={photoSubmission.overallVote?.humour}
					editable={false}
				/>
			</div>
			<div class="slider-container">
				<div class="slider-text-container">
					<p class="slider-text">Creativity</p>
				</div>
				<Slider
					color="purple"
					width="100%"
					height="100%"
					outerBorderSize={borderSize}
					value={photoSubmission.overallVote?.creativity}
					editable={false}
				/>
			</div>
			<div class="slider-container">
				<div class="slider-text-container">
					<p class="slider-text">Photography</p>
				</div>
				<Slider
					color="green"
					width="100%"
					height="100%"
					outerBorderSize={borderSize}
					value={photoSubmission.overallVote?.photography}
					editable={false}
				/>
			</div>
		</div>
	{:else}
		<div class="no-votes-container" style="--border-size: {borderSize}; --sliders-height: {slidersHeight};">
			<p class="no-votes-text">This submission has no votes.</p>
		</div>
	{/if}
</div>

<style>
	.photo-submission-container {
		width: 100%;
		padding-bottom: 100%;
		position: relative;
		background-color: grey;
	}
	.sliders-container {
		display: grid;
		padding: var(--border-size);
		background-color: black;
		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		height: var(--sliders-height);
	}
	.slider-text-container {
		width: 100%;
		container-type: inline-size;
	}
	.slider-text {
		font-size: 1.25em;
	}
	@container (max-width: 8rem) {
		.slider-text {
			font-size: 0.85em;
		}
	}

	.slider-container {
		display: flex;
		color: white;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.photo {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		background-repeat: no-repeat;
		background-size: cover;
		background-clip: border-box;
		background-position: center;
		z-index: 1;
	}
	.photo-submission-loading-text {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translate(0, -50%);
		text-align: center;
		color: white;
	}
	.vote-text-container {
		background-color: black;
		color: white;
		padding-top: 0.5rem;
		container-type: inline-size;
	}
	.vote-text {
		line-height: 1;
		font-size: 1em;
	}
	@container (max-width: 24rem) {
		.vote-text {
			font-size: 0.7em;
		}
	}

	.no-votes-container {
		background-color: black;
		padding: var(--border-size);
		height: var(--sliders-height);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.info-container {
		display: flex;
		position: absolute;
		z-index: 2;
		--padding: 0.5rem;
		width: calc(100% - 2 * var(--padding));
		padding: var(--padding);
		justify-content: space-between;
	}
</style>
