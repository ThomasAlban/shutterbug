<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, errors, enhance, constraints } = superForm(data.form);
</script>

<h1>Login</h1>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input type="text" name="username" bind:value={$form.username} {...$constraints.username} />
	{#if $errors.username}
		{$errors.username}
	{/if}
	<br />

	<label for="password">Password</label>
	<input type="password" name="password" bind:value={$form.password} {...$constraints.password} />
	{#if $errors.password}
		{$errors.password}
	{/if}
	<br />

	<button type="submit">Log in</button>
</form>

<a href="/auth/register">Register</a>
<br />
<a href="/auth/forgot">Forgot Username/Password</a>
