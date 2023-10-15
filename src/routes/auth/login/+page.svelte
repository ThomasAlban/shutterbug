<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Form } from 'formsnap';
	import { loginSchema } from './schema';
	import '$lib/style.css';
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

<div class="wrapper">
	<h1>Login</h1>

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

		<Button type="submit" fontSize={2} {loading} width={9}>Log in</Button>
	</Form.Root>

	<div class="links">
		<Button fontSize={1.5} link="/auth/register" invertColor={true}>Register</Button>
		<br />
		<Button fontSize={1.5} link="/auth/forgot" invertColor={true}>Forgot credentials</Button>
	</div>
</div>
