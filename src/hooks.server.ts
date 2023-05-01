import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import db from '$lib/server/db';
import { JWT_ACCESS_SECRET } from '$env/static/private';

// this function is run on every request
export async function handle({ event, resolve }) {
	const { headers } = event.request;

	// get the cookie from the headers of the request
	const cookies = parse(headers.get('cookie') ?? '');

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

	return await resolve(event);
}
