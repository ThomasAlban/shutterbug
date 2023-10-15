<script lang="ts">
	import { registerSchema } from './schema.js';
	import { Form } from 'formsnap';
	import Button from '$lib/components/Button.svelte';
	import '$lib/style.css';

	export let data;

	let loading = false;
</script>

<div class="wrapper">
	<h1>Register</h1>

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
			<Form.Label>Username:</Form.Label>
			<Form.Validation />
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

		<Button type="submit" fontSize={2} {loading} width={10}>Register</Button>
	</Form.Root>

	<div class="links">
		<Button fontSize={1.5} link="/auth/login" invertColor={true}>Back to login</Button>
	</div>
</div>
