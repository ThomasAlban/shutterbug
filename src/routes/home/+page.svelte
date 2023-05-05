<script lang="ts">
	// this is the data returned from the load function
	export let data;
	$: ({ user } = data);
</script>

welcome, {user.username}!
<br />
<a href="/auth/logout">Log Out</a>
