import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { registerSchema } from './schema.js';
import { setError, superValidate } from 'sveltekit-superforms/server';

export async function load(event) {
	// sveltekit superforms function which we run and return to the page on load so that the page knows the validation info of the form
	const form = await superValidate(event, registerSchema);
	return { form };
}

export const actions = {
	// runs when the register form is submitted
	async default(event) {
		// validate the form submitted against the schema we defined
		const form = await superValidate(event, registerSchema);
		// return fail if not valid
		if (!form.valid) return fail(400, { form });

		// return fail if emails or passwords don't match
		if (form.data.email !== form.data.email2) return setError(form, 'email2', 'Emails do not match');
		if (form.data.password !== form.data.password2) return setError(form, 'password2', 'Passwords do not match');

		// check if the username is taken
		const userExists = await db.getUniqueUserByUsername(form.data.username);
		if (userExists) return setError(form, 'username', 'Username taken');

		// check if the email is taken
		const emailExists = await db.getUniqueUserByEmail(form.data.email);
		if (emailExists) return setError(form, 'email', 'Email taken');

		// if we have passed all these checks, create the user
		await db.createUser(form.data.username, form.data.email, form.data.password);

		// Redirect to the login page
		throw redirect(303, '/auth/login?registerSuccess');
	}
};
