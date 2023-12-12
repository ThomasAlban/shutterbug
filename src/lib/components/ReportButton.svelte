<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';
	import FormButton from './FormButton.svelte';

	let reportFormVisible = false;
	let reportReasonVisible = false;
</script>

<div class="report-container">
	{#if reportFormVisible}
		<h2>Report User</h2>

		<!-- <button hidden={reportReasonVisible} on:click={() => (reportReasonVisible = true)}>Include Reason</button> -->
		{#if reportReasonVisible}
			<textarea form="reportform" name="reason" placeholder="reason..." />
		{:else}
			<Button invertColor={true} size={1} on:click={() => (reportReasonVisible = true)}>Include Reason</Button>
		{/if}
		<FormButton
			action="?/report"
			fn={() => {
				reportFormVisible = false;
				reportReasonVisible = false;
			}}
		>
			Send Report
		</FormButton>
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
			<!-- <input type="submit" value="Send Report" /> -->
		</form>
	{:else}
		<Button invertColor={true} size={0.75} on:click={() => (reportFormVisible = true)}>Report User</Button>
	{/if}
</div>

<style>
	.report-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		color: var(--orange);
		--padding: 1rem;
		padding: var(--padding) 0 var(--padding) 0;
	}
	textarea {
		font-family: 'Merriweather-Italic';
	}
</style>
