<script lang="ts">
	export let userID: string;
</script>

<nav>
	<a href="/app/home"><img src="/icons/home.png" alt="home-icon" /></a>
	<a href="/app/friends"><img src="/icons/users.png" alt="users-icon" /></a>
	<a href="/app/user/{userID}"><img src="/icons/user.png" alt="user-icon" /></a>
	<a href="/app/settings"><img src="/icons/settings.png" alt="settings-icon" /></a>
</nav>

<style>
	nav {
		z-index: 10;
		background-color: black;
		overflow: hidden;

		position: fixed;
		bottom: 0;
		margin-left: auto;
		margin-right: auto;
		width: min(100%, var(--max-app-width));
		height: var(--navbar-bottom-height);

		display: grid;
		grid-template-columns: repeat(4, 1fr);
		place-items: center;
	}
	a {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	img {
		width: calc(var(--navbar-bottom-height) / 2);
	}
</style>
