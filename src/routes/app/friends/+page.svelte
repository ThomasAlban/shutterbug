<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import UserWidget from '$lib/components/UserWidget.svelte';
	import { searchSchema } from './schema';
	import { Form } from 'formsnap';

	export let data;
	export let form;
	$: ({ friends, incomingFriendRequests, outgoingFriendRequests } = data);
</script>

<div class="orange" style="text-align: center;">
	<div class="search-container">
		<Form.Root form={data.searchForm} schema={searchSchema} action="?/search" let:config style="display: contents;">
			<Form.Field {config} name="search">
				<Form.Input type="text" placeholder="find friends..." />
			</Form.Field>
			<Button type="submit" invertColor={true}>Go</Button>
		</Form.Root>
	</div>

	{#if form?.searchResult}
		{#if form.searchResult.length > 0}
			<div class="users-container">
				{#each form.searchResult as { user, friendStatus }}
					<UserWidget {user} {friendStatus} maxAllowedWidth={300} />
				{/each}
			</div>
		{:else}
			<i>No results.</i>
		{/if}
		<br />
	{/if}
</div>

<br />

{#if incomingFriendRequests.length > 0}
	<div class="users-container">
		<h3>Incoming Friend Requests</h3>
		{#each incomingFriendRequests as user}
			<UserWidget {user} friendStatus="incomingRequest" maxAllowedWidth={300} />
		{/each}
	</div>
{/if}

<div class="users-container">
	<h3>Friends</h3>

	{#each friends as user}
		<UserWidget {user} friendStatus="friends" maxAllowedWidth={300} />
	{:else}
		None
	{/each}
</div>

{#if outgoingFriendRequests.length > 0}
	<div class="users-container">
		<h3>Outgoing Friend Requests</h3>
		{#each outgoingFriendRequests as user}
			<UserWidget {user} friendStatus="outgoingRequest" />
		{/each}
	</div>
{/if}

<style>
	.search-container {
		padding: 1rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.users-container {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
