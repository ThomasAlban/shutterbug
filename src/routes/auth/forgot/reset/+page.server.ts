import { error, fail, redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { usernameSchema, passwordSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';

// this utility function is used to check if the URL parameters on this page are correct, and create an error if not
// this is important for security, so that the reset page only works if you have clicked a valid link
async function validateUrlParams(event: ServerLoadEvent | RequestEvent) {
	// get the token and user ID URL params
	const tokenParam = event.url.searchParams.get('token');
	const userIDParam = event.url.searchParams.get('userID');

	// if either of them don't exist throw and error
	if (!tokenParam) throw error(400, { message: 'Token not found' });
	if (!userIDParam) throw error(400, { message: 'UserID not found' });

	// get the user which the userID references, failing if they don't exist
	const user = await db.getUniqueUserByUserID(userIDParam);
	if (!user) throw error(400, { message: 'User does not exist' });

	// validate the reset token in the database, failing if not valid
	const valid = await db.validateResetToken(userIDParam, tokenParam);
	if (!valid) throw error(400, { message: 'Invalid token' });

	return { userIDParam, tokenParam, user };
}

export async function load(event) {
	// validate the url parameters using the function above
	const { userIDParam, tokenParam } = await validateUrlParams(event);

	// sveltekit superforms functions which we run and return to the page on load so that the page knows the validation info of the forms
	const usernameForm = await superValidate(event, usernameSchema);
	const passwordForm = await superValidate(event, passwordSchema);
	return { usernameForm, passwordForm, tokenParam, userIDParam };
}

export const actions = {
	// this function runs when the user submits the username form
	async username(event) {
		const { userIDParam, user } = await validateUrlParams(event);
		const form = await superValidate(event, usernameSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.username === user.username) return setError(form, 'username', 'Username has not changed');

		const usernameExists = await db.getUniqueUserByUsername(form.data.username);
		if (usernameExists) return setError(form, 'username', 'Username taken');

		await db.updateUsername(userIDParam, form.data.username);

		throw redirect(303, '/auth/login?reset="username"');
	},

	async password(event) {
		// this function runs when the user submits the password form
		const { userIDParam, user } = await validateUrlParams(event);

		const form = await superValidate(event, passwordSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.password !== form.data.password2) return setError(form, 'password2', 'Passwords do not match');

		if (await bcrypt.compare(form.data.password, user.password))
			return setError(form, 'password', 'Password has not changed');

		await db.updatePassword(userIDParam, form.data.password);

		throw redirect(303, '/auth/login?reset="password"');
	}
};
