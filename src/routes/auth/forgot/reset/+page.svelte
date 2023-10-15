<script lang="ts">
	import { Form } from 'formsnap';
	import '$lib/style.css';
	import { usernameSchema, passwordSchema } from './schema';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';

	export let data;
	let [usernameLoading, passwordLoading] = [false, false];

	let token = $page.url.searchParams.get('token');
	let userID = $page.url.searchParams.get('userID');
</script>

<div class="wrapper">
	<h1>Reset Credentials</h1>

	<Form.Root
		form={data.usernameForm}
		schema={usernameSchema}
		action="?/username&userID={userID}&token={token}"
		let:config
		options={{
			onSubmit: () => (usernameLoading = true),
			onResult: () => (usernameLoading = false)
		}}
	>
		<Form.Field {config} name="username">
			<Form.Label>New Username:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="text" />
		</Form.Field>
		<br />

		<Button type="submit" fontSize={2} loading={usernameLoading} width={9}>Submit</Button>
	</Form.Root>

	<br />

	<Form.Root
		form={data.passwordForm}
		schema={passwordSchema}
		action="?/password&userID={userID}&token={token}"
		let:config
		options={{
			onSubmit: () => (passwordLoading = true),
			onResult: () => (passwordLoading = false)
		}}
	>
		<Form.Field {config} name="password">
			<Form.Label>New Password:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<Form.Field {config} name="password2">
			<Form.Label>Retype Password:</Form.Label> <br />
			<Form.Validation />
			<Form.Input type="password" />
		</Form.Field>
		<br />

		<Button type="submit" fontSize={2} loading={passwordLoading} width={9}>Submit</Button>
	</Form.Root>

	<div class="links">
		<Button fontSize={1.5} link="/auth/login" invertColor={true}>Back to login</Button>
	</div>
</div>
