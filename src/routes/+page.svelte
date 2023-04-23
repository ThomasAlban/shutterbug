<script lang="ts">
    import { onMount } from "svelte";
    let user: App.UserRow;
    onMount(async () => {
        const response = await fetch("/api", {
            method: "GET",
        });
        let rows = await response.json();

        user = rows[0];
    });
</script>

{#if user}
    User ID: {user.user_id} <br />
    Username: {user.username} <br />
    Password: {user.password} <br />
    Date Created: {user.date_created} <br />
    Profile Photo: {user.profile_photo} <br />
    Admin: {user.admin} <br />
{/if}
