import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import bcrypt from 'bcrypt';

export function load({ locals }) {
	// If the user is already logged in, redirect them to the home page
	if (locals.user) {
		if (locals.user.admin) throw redirect(302, '/admin/home');
		throw redirect(302, '/home');
	}
}

// this function runs when the form is submitted
export const actions = {
	async default({ request }) {
		const formData = Object.fromEntries(await request.formData());

		// check to make sure the username and password inputs are valid
		if (!formData.username || !formData.password) return fail(400, { message: 'Invalid input' });

		if (formData.password !== formData.password2)
			return fail(400, { message: 'Passwords do not match' });

		// get the username and password out of the formdata object
		const { username, password } = formData as {
			username: string;
			password: string;
		};

		const usernameTaken = await db.user.findUnique({
			where: { username }
		});

		if (usernameTaken) return fail(400, { message: 'Username taken' });

		// create a new user
		try {
			await db.user.create({
				data: {
					username,
					// store in the database a hashed version of their password
					password: await bcrypt.hash(password, 10)
				}
			});
		} catch (error) {
			return fail(500, { error });
		}

		// Redirect to the login page
		throw redirect(302, '/login');
	}
};
