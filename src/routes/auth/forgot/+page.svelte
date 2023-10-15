<script lang="ts">
	import { Form } from 'formsnap';
	import '$lib/style.css';
	import { emailSchema } from './schema';
	import Button from '$lib/components/Button.svelte';
	import { toasts } from 'svelte-toasts';

	export let data;
	export let form;

	let loading = false;

	$: if (form?.success)
		toasts.add({
			title: 'Reset email sent',
			description: 'Check your inbox and your spam folder...',
			placement: 'bottom-center',
			type: 'success'
		});
</script>

<div class="wrapper">
	<h1>Forgot your credentials?</h1>
	<p>Enter your email, and a reset link will be sent which will be valid for 10 minutes.</p>

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
			<Form.Label>Email:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="text" />
		</Form.Field>
		<br />
		<Button type="submit" fontSize={2} {loading} width={10}>Submit</Button>
	</Form.Root>

	<div class="links">
		<Button fontSize={1.5} link="/auth/login" invertColor={true}>Back to login</Button>
	</div>
</div>
