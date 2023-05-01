import { redirect } from '@sveltejs/kit';

export function load(event) {
	// if the user is not logged in, redirect them to the login page
	if (!event.locals.user) throw redirect(302, '/login');

	return { user: event.locals.user };
}
