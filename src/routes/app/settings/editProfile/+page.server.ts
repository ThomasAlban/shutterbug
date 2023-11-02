import { error, fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import * as jwt from '$lib/server/jwt';

import { setError, superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';
import { usernameSchema, emailSchema, passwordSchema } from './schema';

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

		return { usernameSuccess: true, newUsername: form.data.username, form };
	},
	async email(event) {
		const form = await superValidate(event, emailSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.newEmail !== form.data.newEmail2) return setError(form, 'newEmail2', 'Emails do not match');

		const userWithSameEmail = await db.getUniqueUserByEmail(form.data.newEmail);
		if (userWithSameEmail) return setError(form, 'newEmail', 'User with the same email already exists');

		await db.updateEmail(event.locals.user!.userID, form.data.newEmail);

		return { emailSuccess: true, newEmail: form.data.newEmail, form };
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

		return { passwordSuccess: true, form };
	},
	async upload(event) {
		const form = Object.fromEntries(await event.request.formData());

		if (
			!form.image ||
			!(form.image instanceof File) ||
			!(form.image as File).name ||
			(form.image as File).name === 'undefined'
		)
			return fail(400, { message: 'You must provide an image to upload' });

		const img = form.image as File;
		if (img.type.split('/')[0] !== 'image') return fail(400, { message: 'File is not an image' });

		// check that the image is not larger than 10MB (arbitrary)
		if (img.size > 10_000_000) return fail(400, { message: 'Image size too large' });

		await db.updateProfilePicture(img, event.locals.user!.userID);

		return { uploadSuccess: true };
	}
};
