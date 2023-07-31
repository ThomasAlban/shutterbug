<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	$: ({ reports, themes } = data);
</script>

<h1>Admin - Home Page</h1>
<a href="/auth/logout">Log Out</a>
<h2>Reports</h2>

<a href="/admin/user/search">Search For Users</a>

<br /><br />

<table>
	<tr>
		<th>Reporter ID</th>
		<th>Culprit ID</th>
		<th>Reason</th>
		<th>Delete</th>
	</tr>

	{#each reports as report}
		<tr>
			<td>
				<a href="/admin/user/{report.reporterID}">{report.reporterID}</a>
			</td>
			<td>
				<a href="/admin/user/{report.culpritID}">{report.culpritID}</a>
			</td>
			<td>{report.reason}</td>
			<td>
				<form
					action="?/deleteReport&reporterID={report.reporterID}&culpritID={report.culpritID}"
					method="post"
					use:enhance
				>
					<button type="submit">Delete</button>
				</form>
			</td>
		</tr>
	{:else}
		<i>There are no reports.</i>
	{/each}
</table>

<h2>Themes</h2>

<table>
	<tr>
		<th>Theme ID</th>
		<th>Theme</th>
		<th>Date Start</th>
		<th>Date End</th>
	</tr>

	{#each themes as theme}
		<tr>
			<td>{theme.themeID}</td>
			<td>{theme.theme}</td>
			<td>{theme.dateStart}</td>
			<td>{theme.dateEnd}</td>
		</tr>
	{:else}
		<i>There are no themes.</i>
	{/each}
</table>

<h3>Create Theme</h3>

<form action="?/createTheme" method="post" use:enhance>
	<label for="theme">Theme:</label>
	<input type="text" name="theme" id="theme" required />
	<br />
	<label for="dateStart">Date Start:</label>
	<input type="datetime-local" name="dateStart" id="dateStart" required />
	<br />
	<label for="dateEnd">Date End:</label>
	<input type="datetime-local" name="dateEnd" id="dateEnd" required />
	<br />
	<button type="submit">Submit</button>
</form>

<style>
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		padding: 5px;
	}
</style>
