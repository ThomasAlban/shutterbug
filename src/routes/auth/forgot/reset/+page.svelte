<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const {
		form: usernameForm,
		errors: usernameErrors,
		enhance: usernameEnhance,
		constraints: usernameConstraints
	} = superForm(data.usernameForm);

	const {
		form: passwordForm,
		errors: passwordErrors,
		enhance: passwordEnhance,
		constraints: passwordConstraints
	} = superForm(data.passwordForm);
</script>

<h2>Reset Username/Password</h2>

<form method="post" action="?/username&userID={data.userIDParam}&token={data.tokenParam}" use:usernameEnhance>
	<label for="username">New Username:</label>
	<input type="text" name="username" bind:value={$usernameForm.username} {...$usernameConstraints.username} />
	{#if $usernameErrors.username}
		$usernameErrors.username
	{/if}
	<br />

	<input type="submit" value="Submit" />
</form>

<br />

<form method="post" action="?/password&userID={data.userIDParam}&token={data.tokenParam}" use:passwordEnhance>
	<label for="password">New Password:</label>
	<input type="password" name="password" bind:value={$passwordForm.password} {...$passwordConstraints.password} />
	{#if $passwordErrors.password}
		$passwordErrors.password
	{/if}
	<br />

	<label for="password2">Retype Password:</label>
	<input type="password" name="password2" bind:value={$passwordForm.password2} {...$passwordConstraints.password2} />
	{#if $passwordErrors.password2}
		$passwordErrors.password2
	{/if}
	<br />

	<input type="submit" value="Submit" />
</form>
