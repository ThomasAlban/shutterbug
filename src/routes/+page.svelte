<script lang="ts">
	export let data;
	$: ({ users } = data);
</script>

{#each users as user}
	User ID: {user.userID} <br />
	Username: {user.username} <br />
	Password: {user.password} <br />
	Date Created: {user.dateCreated} <br />
	Profile Photo: {user.profilePhoto} <br />
	Admin: {user.admin} <br /> <br />
{/each}
