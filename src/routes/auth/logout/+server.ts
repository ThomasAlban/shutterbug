import { redirect } from '@sveltejs/kit';

// runs when a post request is sent to /auth/logout
export function POST(event) {
	// delete the user's login cookie
	event.cookies.delete('AuthorizationToken', { path: '/' });
	// redirect them back to the login page
	throw redirect(303, '/');
}
