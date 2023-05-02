<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
	$: message = form?.message;
</script>

<h1>Register</h1>

<form method="post" use:enhance>
	<div class="group">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" required />
	</div>
	<div class="group">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
	</div>
	<div class="group">
		<label for="password2">Retype Password</label>
		<input type="password" name="password2" id="password2" required />
	</div>
	<div class="submit-container">
		<button type="submit">Sign Up</button>
	</div>
</form>

{#if message}
	<p><i>{message}, please try again.</i></p>
{/if}
