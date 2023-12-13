<script lang="ts">
	import { Form } from 'formsnap';
	import { emailSchema } from './schema';
	import Button from '$lib/components/Button.svelte';
	import { successToast } from '$lib/util';

	export let data;
	export let form;

	// variable set to true on form submit and false on result. Used to display a loading spinner on the button if true
	let loading = false;

	// if the form was successful, add a toast
	$: if (form?.success) successToast('Reset email sent', 'Check your inbox and your spam folder...');
</script>

<div class="auth-wrapper">
	<h1 class="orange-text">Forgot your credentials?</h1>
	<p>Enter your email, and a reset link will be sent which will be valid for 10 minutes.</p>

	<!-- this is the enter email form -->
	<Form.Root
		form={data.form}
		schema={emailSchema}
		let:config
		options={{
			onSubmit: () => (loading = true),
			onResult: () => (loading = false)
		}}
	>
		<Form.Field {config} name="email">
			<!-- form field label -->
			<Form.Label>Email:</Form.Label> <br />
			<!-- if there are any validation errors, these will be displayed here -->
			<Form.Validation />
			<!-- form field input -->
			<Form.Input type="text" />
		</Form.Field>
		<br />
		<!-- submit button -->
		<div class="auth-submit-container">
			<Button type="submit" {loading}>Submit</Button>
		</div>
	</Form.Root>

	<div class="auth-links">
		<Button link="/auth/login" invertColor={true}>Back to login</Button>
	</div>
</div>
