import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { sendResetEmail } from '$lib/server/mail.js';

const emailSchema = z.object({
	email: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email()
});

export async function load(event) {
	const form = await superValidate(event, emailSchema);
	return { form };
}

export const actions = {
	async email(event) {
		const form = await superValidate(event, emailSchema);
		if (!form.valid) return fail(400, { form });

		const user = await db.getUniqueUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'User with that email does not exist');

		const token = await db.setResetToken(user.userID);

		// temporary localhost link, will change when the app is in production
		const link = `http://localhost:5173/auth/forgot/reset?userID=${user.userID}&token=${token}`;

		console.log('about to send reset email');

		sendResetEmail(form.data.email, link);

		console.log(link);
	}
};
