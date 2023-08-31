<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	$: ({ reports, themes } = data);

	const {
		form: createThemeForm,
		errors: createThemeErrors,
		enhance: createThemeEnhance,
		constraints: createThemeConstraints
	} = superForm(data.createThemeForm);
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
					<form
						action="?/deleteReport"
						method="post"
						use:enhance={({ submitter }) => {
							submitter?.setAttribute('disabled', 'true');
							return ({ update }) => update().then(() => submitter?.removeAttribute('disabled'));
						}}
					>
						<input type="hidden" name="reporterID" value={report.reporterID} />
						<input type="hidden" name="culpritID" value={report.culpritID} />
						<button type="submit">Delete</button>
					</form>
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

<form action="?/createTheme" method="post" use:createThemeEnhance>
	<label for="theme">Theme:</label>
	<input type="text" name="theme" id="theme" bind:value={$createThemeForm.theme} {...$createThemeConstraints.theme} />
	{#if $createThemeErrors.theme}
		{$createThemeErrors.theme}
	{/if}
	<br />

	<label for="dateStart">Date Start (GMT):</label>
	<input
		type="datetime-local"
		name="dateStart"
		id="dateStart"
		bind:value={$createThemeForm.dateStart}
		{...$createThemeConstraints.dateEnd}
	/>
	{#if $createThemeErrors.dateStart}
		{$createThemeErrors.dateStart}
	{/if}
	<br />

	<label for="dateEnd">Date End (GMT):</label>
	<input
		type="datetime-local"
		name="dateEnd"
		id="dateEnd"
		bind:value={$createThemeForm.dateEnd}
		{...$createThemeConstraints.dateEnd}
	/>
	{#if $createThemeErrors.dateEnd}
		{$createThemeErrors.dateEnd}
	{/if}
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
