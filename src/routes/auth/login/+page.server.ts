import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import bcrypt from 'bcrypt';
import { loginSchema } from './schema';

import { setError, superValidate } from 'sveltekit-superforms/server';
import * as jwt from '$lib/server/jwt';

export async function load(event) {
	// sveltekit superforms function which we run and return to the page on load so that the page knows the validation info of the form
	const form = await superValidate(event, loginSchema);
	return { form };
}

export const actions = {
	// this function runs when the form is submitted
	async default(event) {
		// validate the form submitted against the schema we defined
		const form = await superValidate(event, loginSchema);
		// return fail if not valid
		if (!form.valid) return fail(400, { form });

		// get the user from the database, failing if they don't exist
		const user = await db.getUniqueUserByUsername(form.data.username);
		if (!user) return setError(form, 'username', 'User does not exist');

		// verify the password, failing if not valid
		const passwordIsValid = await bcrypt.compare(form.data.password, user.password);
		if (!passwordIsValid) return setError(form, 'password', 'Incorrect password');

		// this is the user information which will be stored in the JWT token
		const userData = {
			userID: user.userID,
			username: user.username,
			admin: user.admin
		};
		// set the cookie, which means the user is now logged in
		await jwt.setUserToken(event, userData);

		return { form };
	}
};
