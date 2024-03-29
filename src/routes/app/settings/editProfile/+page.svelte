<script lang="ts">
	import UploadWidget from '$lib/components/UploadWidget.svelte';
	import { Form } from 'formsnap';
	import { emailSchema, usernameSchema, passwordSchema } from './schema';
	import Button from '$lib/components/Button.svelte';
	import { successToast } from '$lib/util';
	export let form;

	export let data;

	// stores whether any of the forms are currently loading
	let loading = {
		username: false,
		email: false,
		password: false
	};

	// enum of which thing we are currently editing
	let edit: 'profilePicture' | 'username' | 'email' | 'password' | undefined = undefined;

	// create toasts if any form is successful
	$: if (form?.uploadSuccess) successToast('Successfully updated profile picture');
	$: if (form?.usernameSuccess) successToast(`Successfully updated username to ${form.newUsername}`);
	$: if (form?.emailSuccess) successToast('`Successfully updated email to ${form.newEmail}`');
	$: if (form?.passwordSuccess) successToast('Successfully updated password');

	// set it so we are not currently editing anything when a form is successful
	$: if (form?.uploadSuccess || form?.usernameSuccess || form?.emailSuccess || form?.passwordSuccess) edit = undefined;
</script>

<div class="wrapper">
	<!-- heading -->
	<div class="orange">
		<h1>Edit Profile</h1>
	</div>

	<div class="edit-container">
		<h2>Profile picture</h2>
		{#if edit === 'profilePicture'}
			<div class="form-container">
				<UploadWidget
					success={form?.uploadSuccess}
					successMsg="Profile picture changed!"
					errorMsg={form?.message}
					previewShape="circle"
				/>
			</div>
		{:else}
			<Button invertColor={true} on:click={() => (edit = 'profilePicture')}>Edit</Button>
		{/if}
	</div>

	<!-- below are each edit form. Each one is only shown if the edit variable is set to that particular form -->
	<!-- if the form is not shown, a button is instead shown which, when clicked, sets edit to be that form -->
	<!-- this means only 1 part of the profile can be edited at once -->
	<div class="edit-container">
		<h2>Username</h2>
		{#if edit === 'username'}
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
		{:else}
			<Button invertColor={true} on:click={() => (edit = 'username')}>Edit</Button>
		{/if}
	</div>

	<div class="edit-container">
		<h2>Email</h2>
		{#if edit === 'email'}
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
		{:else}
			<Button invertColor={true} on:click={() => (edit = 'email')}>Edit</Button>
		{/if}
	</div>

	<div class="edit-container">
		<h2>Password</h2>
		{#if edit === 'password'}
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
		{:else}
			<Button invertColor={true} on:click={() => (edit = 'password')}>Edit</Button>
		{/if}
	</div>
</div>

<style>
	.edit-container {
		padding: 1rem;
	}
	.form-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
		line-height: 3rem;
	}
</style>
