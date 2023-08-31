import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';

const registerSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	password2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim()
});

export async function load(event) {
	const form = await superValidate(event, registerSchema);
	return { form };
}

export const actions = {
	async default(event) {
		const form = await superValidate(event, registerSchema);
		if (!form.valid) return fail(400, { form });

		const user = await db.getUniqueUserByUsername(form.data.username);
		if (user) return setError(form, 'username', 'Username taken');

		if (form.data.password !== form.data.password2) return setError(form, 'password2', 'Passwords do not match');

		await db.createUser(form.data.username, form.data.password);

		// Redirect to the login page
		throw redirect(303, '/auth/login');
	}
};
