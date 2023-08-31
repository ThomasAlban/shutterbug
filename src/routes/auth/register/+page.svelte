<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, errors, enhance, constraints } = superForm(data.form);
</script>

<h1>Register</h1>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input type="text" name="username" id="username" bind:value={$form.username} {...$constraints.username} />
	{#if $errors.username}
		{$errors.username}
	{/if}
	<br />

	<label for="username">Password</label>
	<input type="password" name="password" id="password" bind:value={$form.password} {...$constraints.password} />
	{#if $errors.password}
		{$errors.password}
	{/if}
	<br />

	<label for="username">Retype Password</label>
	<input type="password" name="password2" id="password2" bind:value={$form.password2} {...$constraints.password2} />
	{#if $errors.password2}
		{$errors.password2}
	{/if}
	<br />

	<button type="submit">Sign Up</button>
</form>
<a href="/auth/login">Back</a>
