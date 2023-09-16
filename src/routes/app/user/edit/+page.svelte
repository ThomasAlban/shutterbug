<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	$: ({ user } = data);
	const {
		form: usernameForm,
		errors: usernameErrors,
		enhance: usernameEnhance,
		constraints: usernameConstraints
	} = superForm(data.usernameForm);

	const {
		form: emailForm,
		errors: emailErrors,
		enhance: emailEnhance,
		constraints: emailConstraints
	} = superForm(data.emailForm);

	const {
		form: passwordForm,
		errors: passwordErrors,
		enhance: passwordEnhance,
		constraints: passwordConstraints
	} = superForm(data.passwordForm);
</script>

<h2>Edit Username ({user.username})</h2>

<form method="post" action="?/username" use:usernameEnhance>
	<label for="username">New Username:</label>
	<input type="text" name="username" bind:value={$usernameForm.username} {...$usernameConstraints.username} />
	{#if $usernameErrors.username}
		{$usernameErrors.username}
	{/if}
	<br />

	<label for="password">Enter Password:</label>
	<input type="password" name="password" bind:value={$usernameForm.password} {...$usernameConstraints.password} />
	{#if $usernameErrors.password}
		{$usernameErrors.password}
	{/if}
	<br />

	<input type="submit" value="Submit" />
</form>

<h2>Edit Email</h2>

<form method="post" action="?/email" use:emailEnhance>
	<label for="oldEmail">Old Email:</label>
	<input type="email" name="oldEmail" bind:value={$emailForm.oldEmail} {...$emailConstraints.oldEmail} />
	{#if $emailErrors.oldEmail}
		{$emailErrors.oldEmail}
	{/if}
	<br />

	<label for="newEmail">New Email:</label>
	<input type="email" name="newEmail" bind:value={$emailForm.newEmail} {...$emailConstraints.newEmail} />
	{#if $emailErrors.newEmail}
		{$emailErrors.newEmail}
	{/if}
	<br />

	<label for="newEmail2">Retype New Email:</label>
	<input type="email" name="newEmail2" bind:value={$emailForm.newEmail2} {...$emailConstraints.newEmail2} />
	{#if $emailErrors.newEmail2}
		{$emailErrors.newEmail2}
	{/if}
	<br />

	<label for="password">Enter Password:</label>
	<input type="password" name="password" bind:value={$emailForm.password} {...$emailConstraints.password} />
	{#if $emailErrors.password}
		{$emailErrors.password}
	{/if}
	<br />

	<input type="submit" value="Submit" />
</form>

<!-- continued... -->

<h2>Edit Password</h2>

<form method="post" action="?/password" use:passwordEnhance>
	<label for="oldPassword">Old Password:</label>
	<input
		type="password"
		name="oldPassword"
		bind:value={$passwordForm.oldPassword}
		{...$passwordConstraints.oldPassword}
	/>
	{#if $passwordErrors.oldPassword}
		{$passwordErrors.oldPassword}
	{/if}
	<br />

	<label for="newPassword">New Password:</label>
	<input
		type="password"
		name="newPassword"
		bind:value={$passwordForm.newPassword}
		{...$passwordConstraints.newPassword}
	/>
	{#if $passwordErrors.newPassword}
		{$passwordErrors.newPassword}
	{/if}
	<br />

	<label for="newPassword2">Retype New Password:</label>
	<input
		type="password"
		name="newPassword2"
		bind:value={$passwordForm.newPassword2}
		{...$passwordConstraints.newPassword2}
	/>
	{#if $passwordErrors.newPassword2}
		{$passwordErrors.newPassword2}
	{/if}
	<br />

	<input type="submit" value="Submit" />
</form>
