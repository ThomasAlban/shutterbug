<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Form } from 'formsnap';
	import { loginSchema } from './schema';
	import { page } from '$app/stores';
	import { toasts } from 'svelte-toasts';

	// set this variable to whether or not there is a 'registerSuccess' URL param
	// this URL param is set when we are successfully redirected from the register page
	const registerSuccess = $page.url.searchParams.has('registerSuccess');

	// add a toast if there is a registerSuccess url param
	if (registerSuccess)
		toasts.add({
			title: 'Regestration success',
			description: 'Now you can log in!',
			placement: 'bottom-center',
			type: 'success'
		});

	export let data;

	// variable set to true on form submit and false on result. Used to display a loading spinner on the button if true
	let loading = false;
</script>

<div class="auth-wrapper">
	<h1 class="orange-text">Login</h1>

	<!-- this is the login form -->
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
			<!-- form field label -->
			<Form.Label>Username:</Form.Label> <br />
			<!-- if there are any validation errors, these will be displayed here -->
			<Form.Validation />
			<!-- form field input -->
			<Form.Input type="text" />
		</Form.Field>
		<br />

		<Form.Field {config} name="password">
			<Form.Label>Password:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<!-- submit button -->
		<div class="auth-submit-container">
			<Button type="submit" {loading}>Log in</Button>
		</div>
	</Form.Root>

	<div class="auth-links">
		<Button link="/auth/register" invertColor={true}>Register</Button>
		<br />
		<Button link="/auth/forgot" invertColor={true}>Forgot credentials</Button>
		<br />
		<Button link="/" invertColor={true}>Home</Button>
	</div>
</div>
