<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	$: ({ user } = data);
</script>

<h1>Admin User Page: {user.username}</h1>

<p><b>User ID:</b> {user.userID}</p>

<p><b>Date Created:</b> {user.dateCreated}</p>

<p><b>Admin:</b> {user.admin}</p>

<form action="?/toggleAdmin" method="post" use:enhance>
	<button type="submit">
		{user.admin ? 'Demote From Admin' : 'Promote To Admin'}
	</button>
</form>

<p><b>Reports:</b></p>
<ul>
	{#each user.reports as report}
		<li>
			Culprit ID: {report.culpritID} <br />
			Reason: {report.reason} <br />
			<form
				action="?/deleteReport&reporterID={report.reporterID}&culpritID={report.culpritID}"
				method="post"
				use:enhance
			>
				<button type="submit">Delete Report</button>
			</form>
		</li>
	{:else}
		<i>No reports.</i>
	{/each}
</ul>
