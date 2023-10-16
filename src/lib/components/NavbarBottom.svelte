<script lang="ts">
	export let userID: string;
</script>

<div class="navbar-bottom">
	<a href="/app/home"><img src="/icons/home.png" alt="home-icon" class="icon" /></a>
	<a href="/app/friends"><img src="/icons/users.png" alt="users-icon" class="icon" /></a>
	<a href="/app/user/{userID}"><img src="/icons/user.png" alt="user-icon" class="icon" /></a>
	<a href="app/settings"><img src="/icons/settings.png" alt="settings-icon" class="icon" /></a>
</div>

<style>
	.navbar-bottom {
		background-color: black;
		overflow: hidden;

		position: fixed;
		bottom: 0;
		margin-left: auto;
		margin-right: auto;
		width: min(100%, 50rem);
		height: 5rem;

		display: grid;
		grid-template-columns: repeat(4, 1fr);
		place-items: center;
	}
	.icon {
		width: 2.5rem;
	}
</style>
