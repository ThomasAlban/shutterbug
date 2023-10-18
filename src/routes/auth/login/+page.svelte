<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Form } from 'formsnap';
	import { loginSchema } from './schema';
	import { page } from '$app/stores';
	import { toasts } from 'svelte-toasts';

	const registerSuccess = $page.url.searchParams.has('registerSuccess');

	if (registerSuccess)
		toasts.add({
			title: 'Regestration success',
			description: 'Now you can log in!',
			placement: 'bottom-center',
			type: 'success'
		});

	export let data;

	let loading = false;
</script>

<div class="auth-wrapper">
	<h1 class="orange-text">Login</h1>

	<Form.Root
		form={data.form}
		schema={loginSchema}
		let:config
		options={{
			onSubmit: () => (loading = true),
			onResult: () => (loading = false)
		}}
	>
		<Form.Field {config} name="username">
			<Form.Label>Username:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="text" />
		</Form.Field>
		<br />

		<Form.Field {config} name="password">
			<Form.Label>Password:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<div class="auth-submit-container">
			<Button type="submit" {loading}>Log in</Button>
		</div>
	</Form.Root>

	<div class="auth-links">
		<Button link="/auth/register" invertColor={true}>Register</Button>
		<br />
		<Button link="/auth/forgot" invertColor={true}>Forgot credentials</Button>
	</div>
</div>
