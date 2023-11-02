<script lang="ts">
	import UploadWidget from '$lib/components/UploadWidget.svelte';
	import { Form } from 'formsnap';
	import { emailSchema, usernameSchema, passwordSchema } from './schema';
	import Button from '$lib/components/Button.svelte';
	import { toasts } from 'svelte-toasts';
	export let form;

	export let data;

	let loading = {
		username: false,
		email: false,
		password: false
	};

	function toast(title: string) {
		toasts.success({
			title,
			description: ''
		});
	}
	$: if (form?.uploadSuccess) toast('Successfully updated profile picture');
	$: if (form?.usernameSuccess) toast(`Successfully updated username to ${form.newUsername}`);
	$: if (form?.emailSuccess) toast('`Successfully updated email to ${form.newEmail}`');
	$: if (form?.passwordSuccess) toast('Successfully updated password');
</script>

<div class="wrapper">
	<div class="orange">
		<h1>Edit Profile</h1>
	</div>

	<div class="edit-container">
		<h2>Upload/change profile picture</h2>
		<div class="form-container">
			<UploadWidget success={form?.uploadSuccess} successMsg="Profile picture changed!" errorMsg={form?.message} />
		</div>
	</div>

	<div class="edit-container">
		<h2>Edit Username</h2>
		<div class="form-container">
			<Form.Root
				action="?/username"
				form={data.usernameForm}
				schema={usernameSchema}
				let:config
				options={{
					onSubmit: () => (loading.username = true),
					onResult: () => (loading.username = false)
				}}
			>
				<Form.Field {config} name="username">
					<Form.Label>New Username:</Form.Label>
					<Form.Validation />
					<Form.Input type="text" />
				</Form.Field>
				<br />
				<Form.Field {config} name="password">
					<Form.Label>Enter Password:</Form.Label>
					<Form.Validation />
					<Form.Input type="password" />
				</Form.Field>
				<Button type="submit" loading={loading.username}>Submit</Button>
			</Form.Root>
		</div>
	</div>

	<div class="edit-container">
		<h2>Edit Email</h2>
		<div class="form-container">
			<Form.Root
				action="?/email"
				form={data.emailForm}
				schema={emailSchema}
				let:config
				options={{
					onSubmit: () => (loading.email = true),
					onResult: () => (loading.email = false)
				}}
			>
				<Form.Field {config} name="oldEmail">
					<Form.Label>Old Email:</Form.Label>
					<Form.Validation />
					<Form.Input type="email" />
				</Form.Field>
				<br />
				<Form.Field {config} name="newEmail">
					<Form.Label>New Email:</Form.Label>
					<Form.Validation />
					<Form.Input type="email" />
				</Form.Field>
				<br />
				<Form.Field {config} name="newEmail2">
					<Form.Label>Retype New Email:</Form.Label>
					<Form.Validation />
					<Form.Input type="email" />
				</Form.Field>
				<br />
				<Form.Field {config} name="password">
					<Form.Label>Enter Password:</Form.Label>
					<Form.Validation />
					<Form.Input type="password" />
				</Form.Field>
				<Button type="submit" loading={loading.email}>Submit</Button>
			</Form.Root>
		</div>
	</div>

	<div class="edit-container">
		<h2>Edit Password</h2>

		<div class="form-container">
			<Form.Root
				action="?/password"
				form={data.passwordForm}
				schema={passwordSchema}
				let:config
				options={{
					onSubmit: () => (loading.password = true),
					onResult: () => (loading.password = false)
				}}
			>
				<Form.Field {config} name="oldPassword">
					<Form.Label>Old Password:</Form.Label>
					<Form.Validation />
					<Form.Input type="password" />
				</Form.Field>
				<br />
				<Form.Field {config} name="newPassword">
					<Form.Label>New Password:</Form.Label>
					<Form.Validation />
					<Form.Input type="password" />
				</Form.Field>
				<br />
				<Form.Field {config} name="newPassword2">
					<Form.Label>Retype New Password:</Form.Label>
					<Form.Validation />
					<Form.Input type="password" />
				</Form.Field>
				<Button type="submit" loading={loading.password}>Submit</Button>
			</Form.Root>
		</div>
	</div>
</div>

<style>
	.edit-container {
		padding: 1rem;
	}
	.form-container {
		padding: 1rem;
		line-height: 3rem;
	}
</style>
