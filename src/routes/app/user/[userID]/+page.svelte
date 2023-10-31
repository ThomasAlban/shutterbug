<script lang="ts">
	import { enhance } from '$app/forms';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import UserWidget from '$lib/components/UserWidget.svelte';
	import type { ClientUser } from '$lib/server/db.js';

	export let data;
	$: ({ userData } = data);

	let reportFormVisible = false;
	let reportReasonVisible = false;
</script>

<a href="/app/home">Home</a>
<br /><br />

<UserWidget user={userData.user} friendStatus={userData.friendStatus} />

{#if userData.friendStatus === 'self'}
	<a href="/app/user/edit">Edit Profile</a>
{/if}

{#if userData.reported === 'none'}
	<!-- {#if userData.friendStatus === 'none'}
		<form
			method="post"
			action="?/sendRequest"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="submit" value="Send Friend Request" />
		</form>
	{:else if userData.friendStatus === 'outgoingRequest'}
		<form
			method="post"
			action="?/remove"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="submit" value="Remove Friend Request" />
		</form>
	{:else if userData.friendStatus === 'incomingRequest'}
		<form
			method="post"
			action="?/accept"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="submit" value="Accept Friend Request" />
		</form>
		<form
			method="post"
			action="?/remove"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="submit" value="Decline Friend Request" />
		</form>
	{:else if userData.friendStatus === 'friends'}
		<form
			method="post"
			action="?/remove"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="submit" value="Remove Friend" />
		</form>
	{/if} -->

	{#if userData.friendStatus === 'incomingRequest' || userData.friendStatus === 'friends' || userData.friendStatus === 'self'}
		<h2>Photo Submissions</h2>
		{#each userData.photoSubmissions as photoSubmission}
			theme: {photoSubmission.theme.theme} <br />

			{#if photoSubmission.overallVote}
				overall score: <br />
				humour: {photoSubmission.overallVote.humour} creativity: {photoSubmission.overallVote.creativity} photography:
				{photoSubmission.overallVote.photography}
			{:else}
				<i>No one has voted on this post yet.</i>
			{/if}

			<br />
			<img src={photoSubmission.photo.photo} alt="img submission" width="300px" /> <br /> <br />
		{/each}
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

<form action="/auth/logout" method="post">
	<button type="submit">Log Out</button>
</form>
