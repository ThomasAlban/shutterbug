import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { registerSchema } from './schema.js';
import { setError, superValidate } from 'sveltekit-superforms/server';

export async function load(event) {
	const form = await superValidate(event, registerSchema);
	return { form };
}

export const actions = {
	async default(event) {
		const form = await superValidate(event, registerSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.email !== form.data.email2) return setError(form, 'email2', 'Emails do not match');
		if (form.data.password !== form.data.password2) return setError(form, 'password2', 'Passwords do not match');

		const userExists = await db.getUniqueUserByUsername(form.data.username);
		if (userExists) return setError(form, 'username', 'Username taken');

		const emailExists = await db.getUniqueUserByEmail(form.data.email);
		if (emailExists) return setError(form, 'email', 'Email taken');

		await db.createUser(form.data.username, form.data.email, form.data.password);

		// Redirect to the login page
		throw redirect(303, '/auth/login?registerSuccess');
	}
};
