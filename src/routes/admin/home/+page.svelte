<script lang="ts">
	export let data;
	$: ({ reports } = data);
</script>

<h1>Admin - Home Page</h1>
<h2>Reports</h2>

<a href="/admin/usersearch">Search For Users</a>

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
				>
					<button type="submit">Delete</button>
				</form>
			</td>
		</tr>
	{:else}
		<i>There are no reports.</i>
	{/each}
</table>

<style>
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		padding: 5px;
	}
</style>
