import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import * as jwt from '$lib/server/jwt';

const loginSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' })
});

export async function load(event) {
	const form = await superValidate(event, loginSchema);
	return { form };
}

// this function runs when the form is submitted
export const actions = {
	async default(event) {
		const form = await superValidate(event, loginSchema);
		if (!form.valid) return fail(400, { form });

		// get the user from the database
		const user = await db.getUniqueUserByUsername(form.data.username);
		if (!user) return setError(form, 'username', 'User does not exist');

		// verify the password
		const passwordIsValid = await bcrypt.compare(form.data.password, user.password);
		if (!passwordIsValid) return setError(form, 'password', 'Incorrect password');

		// this is the user information which will be stored in the JWT token
		const userData = {
			userID: user.userID,
			username: user.username,
			admin: user.admin
		};

		await jwt.setUserToken(event, userData);

		return { form };
	}
};
