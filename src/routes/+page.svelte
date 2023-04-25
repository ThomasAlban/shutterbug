<script lang="ts">
    import type { PageData } from "./$types";

    // get the data from +page.server.ts and store it in this variable
    export let data: PageData;

    // destructure the variable as we are only interested in users
    // the '$:' means that this statement is reactive. When 'data' changes, 'users' will be updated
    $: ({users} = data);
</script>

{#each users as user }
    User ID: {user.userID} <br />
    Username: {user.username} <br />
    Password: {user.password} <br />
    Date Created: {user.dateCreated} <br />
    Profile Photo: {user.profilePhoto} <br />
    Admin: {user.admin} <br /> <br />
{/each}