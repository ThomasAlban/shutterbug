import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { emailSchema } from './schema';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { sendResetEmail } from '$lib/server/mail.js';
import { APP_URL } from '$env/static/private';

export async function load(event) {
	// sveltekit superforms function which we run and return to the page on load so that the page knows the validation info of the form
	const form = await superValidate(event, emailSchema);
	return { form };
}

export const actions = {
	// this function runs when the form is submitted
	async default(event) {
		// validate against the schema
		const form = await superValidate(event, emailSchema);
		// return fail if not valid
		if (!form.valid) return fail(400, { form });

		// see if there is a user with that email, failing if not
		const user = await db.getUniqueUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'User with that email does not exist');

		// set the reset token in the database
		const token = await db.setResetToken(user.userID);

		// APP_URL is an env variable set to localhost in local environments but which can be set to whatever the URL is of where this website is being hosted
		const link = APP_URL + `/auth/forgot/reset?userID=${user.userID}&token=${token}`;
		// send the reset email
		await sendResetEmail(form.data.email, link);

		return { success: true, form };
	}
};
