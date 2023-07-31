<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
	let message: string | undefined;
	$: message = form?.message;
</script>

<h1>Login</h1>

<form method="post" use:enhance>
	<div class="group">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" required />
	</div>
	<div class="group">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
	</div>
	<div class="submit-container">
		<button type="submit">Log in</button>
	</div>
	<a href="/auth/register">Register</a>
</form>

{#if message}
	<p><i>{message}, please try again.</i></p>
{/if}
