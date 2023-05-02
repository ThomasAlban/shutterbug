import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	// if the user is not logged in, redirect them to the login page
	if (!locals.user) throw redirect(302, '/login');

	return { user: locals.user };
}
