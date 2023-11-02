<script>
	import Button from '$lib/components/Button.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
</script>

<div class="wrapper">
	<div class="orange">
		<h1>Settings</h1>
	</div>
	<div class="links">
		<Button link="/app/settings/editProfile" invertColor={true}>Edit Profile</Button>
		<FormButton action="/auth/logout" useEnhance={false} size={1.75} invertColor={true}>Log Out</FormButton>
	</div>
</div>

<style>
	.links {
		padding: 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
