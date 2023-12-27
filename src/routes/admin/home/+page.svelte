<script lang="ts">
	import { enhance } from '$app/forms';
	import { Form } from 'formsnap';
	import { deleteReportSchema, createThemeSchema, sendNotifSchema } from './schema';
	export let data;
	$: ({ reports, themes } = data);
</script>

<h1>Admin - Home Page</h1>
<form action="/auth/logout" method="post">
	<button type="submit">Log Out</button>
</form>
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

	{#if reports}
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
					<Form.Root form={data.deleteReportForm} schema={deleteReportSchema} let:config action="?/deleteReport">
						<Form.Field {config} name="reporterID">
							<Form.Input type="hidden" value={report.reporterID} />
						</Form.Field>
						<Form.Field {config} name="culpritID">
							<Form.Input type="hidden" value={report.culpritID} />
						</Form.Field>
						<button type="submit">Delete</button>
					</Form.Root>
				</td>
			</tr>
		{:else}
			<i>There are no reports.</i>
		{/each}
	{:else}
		<i>Server error.</i>
	{/if}
</table>

<h2>Themes</h2>

<table>
	<tr>
		<th>Theme ID</th>
		<th>Theme</th>
		<th>Date Start</th>
		<th>Date End</th>
	</tr>

	{#if themes}
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
	{:else}
		<i>Server error.</i>
	{/if}
</table>

<h3>Create Theme</h3>

<Form.Root form={data.createThemeForm} schema={createThemeSchema} let:config action="?/createTheme">
	<Form.Field name="theme" {config}>
		<Form.Label>Theme:</Form.Label>
		<Form.Input type="text" />
		<Form.Validation />
	</Form.Field>
	<Form.Field name="dateStart" {config}>
		<Form.Label>Date Start (GMT):</Form.Label>
		<Form.Input type="datetime-local" />
		<Form.Validation />
	</Form.Field>
	<Form.Field name="dateEnd" {config}>
		<Form.Label>Date End (GMT):</Form.Label>
		<Form.Input type="datetime-local" />
		<Form.Validation />
	</Form.Field>
	<button type="submit">Submit</button>
</Form.Root>

<h3>Send Notification</h3>

<Form.Root form={data.sendNotifForm} schema={sendNotifSchema} let:config action="?/sendNotif">
	<Form.Field name="userID" {config}>
		<Form.Label>User ID:</Form.Label>
		<Form.Input type="text" />
		<Form.Description>(Leave blank to send to all)</Form.Description>
		<Form.Validation />
	</Form.Field>
	<Form.Field name="title" {config}>
		<Form.Label>Title:</Form.Label>
		<Form.Input type="text" />
		<Form.Validation />
	</Form.Field>
	<Form.Field name="body" {config}>
		<Form.Label>Body:</Form.Label>
		<Form.Input type="text" />
		<Form.Validation />
	</Form.Field>
	<button type="submit">Submit</button>
</Form.Root>

<style>
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		padding: 5px;
	}
	/* formsnap label */
	:global([data-fs-label]) {
		--size: 1.5;
		--line-height: 2;

		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		padding: 0;
		margin: 0;

		color: black;
	}
</style>
