<script lang="ts">
	import { enhance } from '$app/forms';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	export let form;
	$: ({ friends, incomingFriendRequests, outgoingFriendRequests } = data);
	const { form: searchForm, enhance: searchEnhance, constraints: searchConstraints } = superForm(data.searchForm);
</script>

<a href="/app/home">Home</a>

<form method="post" action="?/search" use:searchEnhance>
	<label for="search">Find friends</label>
	<input
		type="text"
		placeholder="enter username..."
		name="search"
		bind:value={$searchForm.search}
		{...$searchConstraints.search}
	/>
	<input type="submit" value="Go" />
</form>
<br />

{#if form?.searchResult}
	{#each form.searchResult as sr}
		{#if sr.user.profilePhoto}
			<ProfilePicture src={sr.user.profilePhoto} />
		{/if}
		<a href="/app/user/{sr.user.userID}">{sr.user.username}</a>

		{#if sr.friendStatus === 'friends'}
			<br />
			already friends
		{:else if sr.friendStatus === 'incomingRequest'}
			<form
				method="post"
				action="?/accept"
				use:enhance={({ submitter }) => {
					submitter?.setAttribute('disabled', 'true');
					return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
				}}
			>
				<input type="hidden" name="ID" value={sr.user.userID} />
				<input type="submit" value="Accept" />
			</form>

			<form
				method="post"
				action="?/remove"
				use:enhance={({ submitter }) => {
					submitter?.setAttribute('disabled', 'true');
					return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
				}}
			>
				<input type="hidden" name="ID" value={sr.user.userID} />
				<input type="submit" value="Remove" />
			</form>
		{:else if sr.friendStatus === 'outgoingRequest'}
			<form
				method="post"
				action="?/remove"
				use:enhance={({ submitter }) => {
					submitter?.setAttribute('disabled', 'true');
					return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
				}}
			>
				<input type="hidden" name="ID" value={sr.user.userID} />
				<input type="submit" value="Remove" />
			</form>
		{:else}
			<form
				method="post"
				action="?/sendRequest"
				use:enhance={({ submitter }) => {
					submitter?.setAttribute('disabled', 'true');
					return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
				}}
			>
				<input type="hidden" name="ID" value={sr.user.userID} />
				<input type="submit" value="Send Friend Request" />
			</form>
		{/if}
	{/each}
	<br />
{/if}

<h2>Friends</h2>

{#each friends as user}
	{#if user.profilePhoto}
		<ProfilePicture src={user.profilePhoto} />
	{/if}
	<a href="/app/user/{user.userID}">{user.username}</a>

	<form
		method="post"
		action="?/remove"
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'true');
			return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
		}}
	>
		<input type="hidden" name="ID" value={user.userID} />
		<input type="submit" value="Remove" />
	</form>
	<br />
{:else}
	None
{/each}

<h2>Incoming Friend Requests</h2>
{#if incomingFriendRequests.length > 0}
	{#each incomingFriendRequests as user}
		{#if user.profilePhoto}
			<ProfilePicture src={user.profilePhoto} />
		{/if}
		<a href="/app/user/{user.userID}">{user.username}</a>

		<form
			method="post"
			action="?/accept"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="hidden" name="ID" value={user.userID} />
			<input type="submit" value="Accept" />
		</form>

		<form
			method="post"
			action="?/remove"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="hidden" name="ID" value={user.userID} />
			<input type="submit" value="Remove" />
		</form>
		<br />
	{/each}
{:else}
	None
{/if}

<h2>Outgoing Friend Requests</h2>
{#if outgoingFriendRequests.length > 0}
	{#each outgoingFriendRequests as user}
		{#if user.profilePhoto}
			<ProfilePicture src={user.profilePhoto} />
		{/if}
		<a href="/app/user/{user.userID}">{user.username}</a>

		<form
			method="post"
			action="?/remove"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'true');
				return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
			}}
		>
			<input type="hidden" name="ID" value={user.userID} />
			<input type="submit" value="Remove" />
		</form>
		<br />
	{/each}
{:else}
	None
{/if}
