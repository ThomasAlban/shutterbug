import { error, fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import * as jwt from '$lib/server/jwt';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';

const usernameSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' })
});
const emailSchema = z.object({
	oldEmail: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	newEmail: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	newEmail2: z.string({ invalid_type_error: 'Invalid email', required_error: 'email is required' }).email(),
	password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' })
});
const passwordSchema = z.object({
	oldPassword: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
	newPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' }),
	newPassword2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});

export async function load(event) {
	const [usernameForm, emailForm, passwordForm] = await Promise.all([
		superValidate(event, usernameSchema),
		superValidate(event, emailSchema),
		superValidate(event, passwordSchema)
	]);

	return { user: event.locals.user!, usernameForm, emailForm, passwordForm };
}

export const actions = {
	async username(event) {
		const form = await superValidate(event, usernameSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.username === event.locals.user!.username)
			return setError(form, 'username', 'Username has not changed');

		const passwordIsValid = await db.verifyPasswordByUserID(event.locals.user!.userID, form.data.password);
		if (!passwordIsValid) return setError(form, 'password', 'Incorrect password');

		const userWithSameUsername = await db.getUniqueUserByUsername(form.data.username);
		if (userWithSameUsername) return setError(form, 'username', 'User with the same username already exists');

		await db.updateUsername(event.locals.user!.userID, form.data.username);

		// append the new username to event.locals.user
		const userData = { ...event.locals.user!, username: form.data.username };

		await jwt.setUserToken(event, userData);
	},
	async email(event) {
		const form = await superValidate(event, emailSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.newEmail !== form.data.newEmail2) return setError(form, 'newEmail2', 'Emails do not match');

		const userWithSameEmail = await db.getUniqueUserByEmail(form.data.newEmail);
		if (userWithSameEmail) return setError(form, 'newEmail', 'User with the same email already exists');

		await db.updateEmail(event.locals.user!.userID, form.data.newEmail);
	},
	async password(event) {
		const form = await superValidate(event, passwordSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.newPassword !== form.data.newPassword2)
			return setError(form, 'newPassword2', 'Passwords do not match');

		// get the user from the database
		const user = await db.getUniqueUserByUserID(event.locals.user!.userID);
		if (!user) throw error(500, 'User does not exist');
		// verify the password
		const passwordIsValid = await bcrypt.compare(form.data.oldPassword, user.password);
		if (!passwordIsValid) return setError(form, 'oldPassword', 'Incorrect password');

		if (form.data.oldPassword === form.data.newPassword)
			return setError(form, 'newPassword', 'Password has not changed');

		await db.updatePassword(event.locals.user!.userID, form.data.newPassword);
	}
};
