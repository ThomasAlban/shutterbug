<script lang="ts">
	import { enhance } from '$app/forms';
	import UserWidget from '$lib/components/UserWidget.svelte';
	import PhotoSubmission from '$lib/components/PhotoSubmission.svelte';

	export let data;
	$: ({ userData } = data);

	let reportFormVisible = false;
	let reportReasonVisible = false;
</script>

<UserWidget user={userData.user} friendStatus={userData.friendStatus} />

{#if userData.reported === 'none'}
	{#if userData.friendStatus === 'incomingRequest' || userData.friendStatus === 'friends' || userData.friendStatus === 'self'}
		<h2>Photo Submissions</h2>

		<div class="photo-submissions-container">
			{#each userData.photoSubmissions as photoSubmission}
				<div class="grid-item">
					<PhotoSubmission {photoSubmission} />
				</div>
			{/each}
		</div>
	{/if}
{/if}
<br />

{#if userData.reported === 'reporter'}
	<i>You have reported this user.</i>
	<form
		method="post"
		action="?/deleteReport"
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'true');
			return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
		}}
	>
		<input type="submit" value="Delete Report" />
	</form>
{:else if userData.friendStatus !== 'self'}
	<button hidden={reportFormVisible} on:click={() => (reportFormVisible = true)}>Report User</button>

	{#if reportFormVisible}
		<h2>Report User</h2>
		<button hidden={reportReasonVisible} on:click={() => (reportReasonVisible = true)}>Include Reason</button>
		{#if reportReasonVisible}
			<textarea form="reportform" name="reason" placeholder="reason..." />
		{/if}
		<form
			method="post"
			action="?/report"
			id="reportform"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) =>
					update().then(() => {
						submitter?.removeAttribute('disabled');
						reportFormVisible = false;
						reportReasonVisible = false;
					});
			}}
		>
			<input type="submit" value="Send Report" />
		</form>
	{/if}
{/if}

<style>
	.photo-submissions-container {
		display: grid;
		grid-template-columns: auto auto auto;

		/* this means that the grid will have 2 columns when the screen width is larger than 35 rem, but 1 column otherwise */
		grid-template-columns: repeat(1, minmax(0, 1fr));
		@media (min-width: 35rem) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	.grid-item {
		background-color: rgba(255, 255, 255, 0.8);
		text-align: center;
		border: 1px solid black;
	}
</style>
