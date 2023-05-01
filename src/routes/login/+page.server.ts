import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';

export function load(event) {
	// If the user is already logged in, redirect them to the home page
	if (event.locals.user) throw redirect(302, '/home');
}

// this function runs when the form is submitted
export const actions = {
	async default(event) {
		const formData = Object.fromEntries(await event.request.formData());

		// check to see if form input is valid
		if (!formData.username || !formData.password) return fail(400);

		// get the user data from the login form
		const { username, password } = formData as {
			username: string;
			password: string;
		};

		// get the user from the database
		const user = await db.user.findUnique({
			where: {
				username
			}
		});
		if (!user) return fail(400);

		// verify the password
		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) return fail(400);

		// this is the user information which will be stored in the JWT token
		const jwtUser = {
			userID: user.userID,
			username: user.username,
			admin: user.admin
		};

		// generate a JWT token, which will be stored on the client and used to authenticate the user
		// JWT_ACCESS_SECRET is an environment variable containing a secret string (which can be anything)
		// which is stored on the server and used to sign the JWT token
		const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, {
			expiresIn: '1d'
		});

		// Set the cookie
		event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		if (user.admin) throw redirect(302, '/admin/home');

		throw redirect(302, '/home');
	}
};
