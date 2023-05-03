<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
	$: users = form?.users;
</script>

<form method="post" use:enhance>
	<label for="text">Search For Users:</label>
	<input type="text" name="text" id="text" required />

	<br />

	<label for="username">Search By Username</label>
	<input type="radio" id="username" name="username" value="username" />
	<label for="userID">Search By User ID</label>
	<input type="radio" id="userID" name="userID" value="userID" />

	<br />
	<button type="submit">Submit</button>
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
				<td>
					<a href="/admin/user/{user.userID}">{user.userID}</a>
				</td>
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
