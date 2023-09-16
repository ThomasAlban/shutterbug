<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, errors, enhance, constraints } = superForm(data.form);
</script>

<h1>Forgot your password?</h1>

Enter your email, and if an account exists with that email, a reset link will be sent to that email, which will be valid
for 10 minutes. If you submit the form again, the previous link will stop working.

<br /><br />

<form method="post" action="?/email" use:enhance>
	<label for="email">Email:</label>
	<input name="email" type="email" bind:value={$form.email} {...$constraints.email} />
	{#if $errors.email}
		{$errors.email}
	{/if}
	<br />
	<input type="submit" value="Submit" />
</form>

<a href="/auth/login">Back to Login</a>
