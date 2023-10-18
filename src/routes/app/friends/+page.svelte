<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import UserWidget from '$lib/components/UserWidget.svelte';
	import { acceptSchema, removeSchema, searchSchema, sendRequestSchema } from './schema.js';
	import { Form } from 'formsnap';

	export let data;
	export let form;
	$: ({ friends, incomingFriendRequests, outgoingFriendRequests } = data);
</script>

<div class="orange">
	<div class="search-container">
		<Form.Root form={data.searchForm} schema={searchSchema} action="?/search" let:config style="display: contents;">
			<Form.Field {config} name="search">
				<Form.Input type="text" placeholder="find friends..." />
			</Form.Field>
			<Button type="submit" invertColor={true}>Go</Button>
		</Form.Root>
	</div>

	<div class="results-container">
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
					<Form.Root form={data.acceptForm} schema={acceptSchema} action="?/accept" let:config>
						<Form.Field {config} name="ID">
							<Form.Input type="hidden" value={sr.user.userID} />
						</Form.Field>
						<button type="submit">Accept</button>
					</Form.Root>

					<Form.Root form={data.removeForm} schema={removeSchema} action="?/remove" let:config>
						<Form.Field {config} name="ID">
							<Form.Input type="hidden" value={sr.user.userID} />
						</Form.Field>
						<button type="submit">Remove</button>
					</Form.Root>
				{:else if sr.friendStatus === 'outgoingRequest'}
					<Form.Root form={data.removeForm} schema={removeSchema} action="?/remove" let:config>
						<Form.Field {config} name="ID">
							<Form.Input type="hidden" value={sr.user.userID} />
						</Form.Field>
						<button type="submit">Remove</button>
					</Form.Root>
				{:else}
					<Form.Root form={data.sendRequestForm} schema={sendRequestSchema} action="?/sendRequest" let:config>
						<Form.Field {config} name="ID">
							<Form.Input type="hidden" value={sr.user.userID} />
						</Form.Field>
						<button type="submit">Send Friend Request</button>
					</Form.Root>
				{/if}
			{:else}
				<i>No results</i>
			{/each}
			<br />
		{/if}
	</div>
</div>

<br />

<h2>Friends</h2>

{#each friends as friend}
	<UserWidget user={friend} friendStatus="friends" />
	<!-- {#if friend.profilePhoto}
		<ProfilePicture src={friend.profilePhoto} />
	{/if}
	<a href="/app/user/{friend.userID}">{friend.username}</a>

	<Form.Root form={data.removeForm} schema={removeSchema} action="?/remove" let:config>
		<Form.Field {config} name="ID">
			<Form.Input type="hidden" value={friend.userID} />
		</Form.Field>
		<button type="submit">Remove</button>
	</Form.Root> -->
	<br />
{:else}
	None
{/each}

<h2>Incoming Friend Requests</h2>
{#if incomingFriendRequests.length > 0}
	{#each incomingFriendRequests as incomingFR}
		{#if incomingFR.profilePhoto}
			<ProfilePicture src={incomingFR.profilePhoto} />
		{/if}
		<a href="/app/user/{incomingFR.userID}">{incomingFR.username}</a>

		<Form.Root form={data.acceptForm} schema={acceptSchema} action="?/accept" let:config>
			<Form.Field {config} name="ID">
				<Form.Input type="hidden" value={incomingFR.userID} />
			</Form.Field>
			<button type="submit">Accept</button>
		</Form.Root>

		<Form.Root form={data.removeForm} schema={removeSchema} action="?/remove" let:config>
			<Form.Field {config} name="ID">
				<Form.Input type="hidden" value={incomingFR.userID} />
			</Form.Field>
			<button type="submit">Remove</button>
		</Form.Root>

		<br />
	{/each}
{:else}
	None
{/if}

<h2>Outgoing Friend Requests</h2>
{#if outgoingFriendRequests.length > 0}
	{#each outgoingFriendRequests as outgoingFR}
		{#if outgoingFR.profilePhoto}
			<ProfilePicture src={outgoingFR.profilePhoto} />
		{/if}
		<a href="/app/user/{outgoingFR.userID}">{outgoingFR.username}</a>

		<Form.Root form={data.removeForm} schema={removeSchema} action="?/remove" let:config>
			<Form.Field {config} name="ID">
				<Form.Input type="hidden" value={outgoingFR.userID} />
			</Form.Field>
			<button type="submit">Remove</button>
		</Form.Root>
		<br />
	{/each}
{:else}
	None
{/if}

<style>
	.search-container {
		padding: 1rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.results-container {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
