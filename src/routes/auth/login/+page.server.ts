import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';

const loginSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }).trim()
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
		const jwtUser = {
			userID: user.userID,
			username: user.username,
			admin: user.admin
		};

		// generate a JWT token, which will be stored on the client and used to authenticate the user
		// JWT_ACCESS_SECRET is an environment variable containing a secret string (which can be anything)
		// which is stored on the server and used to sign the JWT token
		const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, { expiresIn: '1d' });

		// Set the cookie
		event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: false,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		return { form };
	}
};
