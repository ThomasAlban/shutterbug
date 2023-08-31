<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	export let form;

	const { form: searchForm, enhance: searchEnhance, constraints: searchConstraints } = superForm(data.form);
</script>

<form method="post" use:searchEnhance>
	<label for="text">Search For Users:</label>
	<input type="text" name="search" bind:value={$searchForm.search} {...$searchConstraints.search} />
	<br />
	<label for="username">Search By Username</label>
	<input type="radio" name="searchBy" value="username" />
	<label for="userID">Search By User ID</label>
	<input type="radio" name="searchBy" value="userID" />
	<br />
	<button type="submit">Submit</button>
</form>

<br />

{#if form?.users}
	<table>
		<tr>
			<th>User ID</th>
			<th>Username</th>
			<th>Date Created</th>
			<th>Admin</th>
		</tr>

		{#each form.users as user}
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
