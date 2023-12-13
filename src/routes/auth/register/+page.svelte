<script lang="ts">
	import { registerSchema } from './schema.js';
	import { Form } from 'formsnap';
	import Button from '$lib/components/Button.svelte';

	export let data;

	// variable set to true on form submit and false on result. Used to display a loading spinner on the button if true
	let loading = false;
</script>

<div class="auth-wrapper">
	<h1 class="orange-text">Register</h1>

	<!-- this is the register form -->
	<Form.Root
		form={data.form}
		schema={registerSchema}
		let:config
		options={{
			onSubmit: () => (loading = true),
			onResult: () => (loading = false)
		}}
	>
		<Form.Field {config} name="username">
			<!-- form field label -->
			<Form.Label>Username:</Form.Label>
			<!-- if there are any validation errors, these will be displayed here -->
			<Form.Validation />
			<!-- form field input -->
			<Form.Input type="text" />
		</Form.Field>
		<br />

		<Form.Field {config} name="email">
			<Form.Label>Email:</Form.Label>
			<Form.Validation />
			<Form.Input type="email" />
		</Form.Field>
		<br />

		<Form.Field {config} name="email2">
			<Form.Label>Retype Email:</Form.Label>
			<Form.Validation />
			<Form.Input type="email" />
		</Form.Field>
		<br />

		<Form.Field {config} name="password">
			<Form.Label>Password:</Form.Label>
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<Form.Field {config} name="password2">
			<Form.Label>Retype Password:</Form.Label>
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<!-- form submit button -->
		<div class="auth-submit-container">
			<Button type="submit" {loading}>Register</Button>
		</div>
	</Form.Root>

	<div class="auth-links">
		<Button link="/auth/login" invertColor={true}>Back to login</Button>
	</div>
</div>
