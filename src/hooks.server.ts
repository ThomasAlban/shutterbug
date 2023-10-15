import * as jwt from '$lib/server/jwt';
import { redirect } from '@sveltejs/kit';

// this function is run on every request
export async function handle({ event, resolve }) {
	const user = await jwt.getUserToken(event);
	event.locals.user = user;

	// routes that non-logged-in users can access
	if (event.url.pathname.startsWith('/auth') && !event.url.pathname.includes('logout')) {
		if (user) {
			if (user.admin) throw redirect(303, '/admin/home');
			throw redirect(303, '/app/home');
		}
	}

	//routes that logged-in users can access
	if (event.url.pathname.startsWith('/app')) {
		if (!user) throw redirect(303, '/auth/login');
	}

	// routes that only admins can access
	if (event.url.pathname.startsWith('/admin')) {
		if (!user) throw redirect(303, '/auth/login');
		if (!user.admin) throw redirect(303, '/app/home');
	}

	return await resolve(event);
}
