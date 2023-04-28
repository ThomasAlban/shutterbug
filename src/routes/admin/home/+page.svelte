<script lang="ts">
    export let data;
    $: ({reports} = data);
</script>

<h1>Admin - Home Page</h1>
<h2>Reports</h2>

<table>
    <tr>
        <th>Reporter ID</th>
        <th>Culprit ID</th>
        <th>Reason</th>
        <th>Delete</th>
    </tr>

    {#each reports as report }
        <tr>
            <td>{report.reporterID}</td>
            <td>{report.culpritID}</td>
            <td>{report.reason}</td>
            <td>Delete</td>
        </tr>
    {/each}

</table>

<br>

<a href="/admin/usersearch">Search For Users</a>

<style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
    }
</style>