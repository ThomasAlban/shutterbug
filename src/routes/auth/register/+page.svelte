<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, errors, enhance, constraints } = superForm(data.form);
</script>

<h1>Register</h1>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input type="text" name="username" bind:value={$form.username} {...$constraints.username} />
	{#if $errors.username}
		{$errors.username}
	{/if}
	<br />

	<label for="email">Email</label>
	<input type="email" name="email" bind:value={$form.email} {...$constraints.email} />
	{#if $errors.email}
		{$errors.email}
	{/if}
	<br />

	<label for="email2">Retype Email</label>
	<input type="email" name="email2" bind:value={$form.email2} {...$constraints.email2} />
	{#if $errors.email2}
		{$errors.email2}
	{/if}
	<br />

	<i>
		Note: if you use an email you don't have access to, you will not be able to recover your account if you forget your
		password.
	</i>
	<br />

	<label for="password">Password</label>
	<input type="password" name="password" bind:value={$form.password} {...$constraints.password} />
	{#if $errors.password}
		{$errors.password}
	{/if}
	<br />

	<label for="password2">Retype Password</label>
	<input type="password" name="password2" bind:value={$form.password2} {...$constraints.password2} />
	{#if $errors.password2}
		{$errors.password2}
	{/if}
	<br />

	<input type="submit" value="Sign Up" />
</form>
<a href="/auth/login">Back</a>
