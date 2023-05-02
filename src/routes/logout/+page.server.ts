import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	// delete the user's login cookie
	cookies.delete('AuthorizationToken');
	// redirect them back to the login page
	throw redirect(302, '/login');
}
