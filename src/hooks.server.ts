import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

// this function is run on every request
export async function handle({ event, resolve }) {
	// get the cookie from the headers of the request
	const cookies = parse(event.request.headers.get('cookie') ?? '');

	if (cookies.AuthorizationToken) {
		// Remove Bearer prefix
		const token = cookies.AuthorizationToken.split(' ')[1];

		try {
			// verify that the cookie has not been tampered with
			const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

			if (typeof jwtUser === 'string') throw new Error();

			// set event.locals.user to the user if they do exist
			// changed this to jwtUser so we are not unnecessarily querying the database
			event.locals.user = {
				userID: jwtUser.userID,
				username: jwtUser.username,
				admin: jwtUser.admin
				// will add more user info to this when and if it is needed
			};
		} catch (error) {
			console.error(error);
		}
	}

	// routes that non-logged-in users can access
	if (event.url.pathname.startsWith('/auth')) {
		if (event.locals.user) {
			if (event.locals.user.admin) throw redirect(303, '/admin/home');
			throw redirect(303, '/home');
		}
	}

	// routes that logged-in users can access
	if (event.url.pathname.startsWith('/home')) {
		if (!event.locals.user) throw redirect(303, '/login');
	}

	// routes that only admins can access
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user) throw redirect(303, '/login');
		if (!event.locals.user.admin) throw redirect(303, '/home');
	}

	return await resolve(event);
}
