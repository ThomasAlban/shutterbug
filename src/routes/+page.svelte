<script lang="ts">
    import { onMount } from "svelte";
    let users: App.UserRow[];
    // this function is run when the page first loads
    onMount(async () => {
        // send a GET request to the API we just created, which returns a response
        const response = await fetch("/api", {
            method: "GET",
        });
        users = await response.json();
    });
</script>

{#if users}
    {#each users as user}
        User ID: {user.user_id} <br />
        Username: {user.username} <br />
        Password: {user.password} <br />
        Date Created: {user.date_created} <br />
        Profile Photo: {user.profile_photo} <br />
        Admin: {user.admin} <br /> <br />
    {/each}
{/if}
