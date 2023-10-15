import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { parse } from 'cookie';

export type jwtUser = {
	userID: string;
	username: string;
	admin: boolean;
};

// run this function in your login form action, after you have successfully validated everything
export async function setUserToken(event: RequestEvent, userData: jwtUser) {
	// generate a JWT token, which will be stored on the client and used to authenticate the user
	// JWT_ACCESS_SECRET is an environment variable containing a secret string (which can be anything)
	// which is stored on the server and used to sign the JWT token
	const token = jwt.sign(userData, JWT_ACCESS_SECRET, { expiresIn: '1d' });

	// Set the cookie
	event.cookies.set('AuthorizationToken', token, {
		httpOnly: true,
		path: '/',
		secure: false,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 // 1 day
	});
}

// run this in the handle hook, and set event.locals.user to the result of this function
// (you will first have to add )
export async function getUserToken(event: RequestEvent) {
	const cookies = parse(event.request.headers.get('cookie') ?? '');

	if (cookies.AuthorizationToken) {
		try {
			const user = jwt.verify(cookies.AuthorizationToken, JWT_ACCESS_SECRET);

			if (typeof user === 'string') throw error(500, { message: 'JWT was of type string' });

			return user as jwtUser;
		} catch (e) {
			throw error(500, { message: 'jwt error: ' + (e as string) });
		}
	}
}
