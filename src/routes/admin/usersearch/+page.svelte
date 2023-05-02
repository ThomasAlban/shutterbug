<script lang="ts">
	import type { User } from '@prisma/client';
	import { enhance } from '$app/forms';

	export let form;

	let users: User[] | undefined;
	$: users = form?.users;
</script>

<form method="post" use:enhance>
	<div class="group">
		<label for="text">Search For Users:</label>
		<input type="text" name="text" id="text" required />
	</div>
	<div class="submit-container">
		<button type="submit">Submit</button>
	</div>
</form>

<br />

{#if users}
	<table>
		<tr>
			<th>User ID</th>
			<th>Username</th>
			<th>Date Created</th>
			<th>Admin</th>
		</tr>

		{#each users as user}
			<tr>
				<td>{user.userID}</td>
				<td>{user.username}</td>
				<td>{user.dateCreated}</td>
				<td>{user.admin}</td>
			</tr>
		{:else}
			<tr>
				<td colspan="4" style="text-align: center">
					<i>No results.</i>
				</td>
			</tr>
		{/each}
	</table>
{/if}

<style>
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		padding: 5px;
	}
</style>
