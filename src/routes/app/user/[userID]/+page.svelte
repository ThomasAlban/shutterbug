<script lang="ts">
	import { enhance } from '$app/forms';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';

	export let data;
	$: ({ userData } = data);
</script>

<a href="/app/home">Home</a>
<br /><br />

<h1>
	{userData.user.username}
	{#if userData.user.profilePhoto}
		<ProfilePicture src={userData.user.profilePhoto} size={100} />
	{/if}
</h1>

{#if userData.friendStatus === 'none'}
	<form
		method="post"
		action="?/sendRequest"
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'true');
			return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
		}}
	>
		<input type="hidden" name="ID" value={userData.user.userID} />
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
		<input type="hidden" name="ID" value={userData.user.userID} />
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
		<input type="hidden" name="ID" value={userData.user.userID} />
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
		<input type="hidden" name="ID" value={userData.user.userID} />
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
		<input type="hidden" name="ID" value={userData.user.userID} />
		<input type="submit" value="Remove Friend" />
	</form>
{/if}

{#if userData.friendStatus === 'incomingRequest' || userData.friendStatus === 'friends' || userData.friendStatus === 'self'}
	<h2>Photo Submissions</h2>
	{#each userData.photoSubmissions as photoSubmission}
		<img src={photoSubmission.photo.photo} alt="img submission" width="300px" />
	{/each}
{/if}
