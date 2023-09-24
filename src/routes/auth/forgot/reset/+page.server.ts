import { error, fail, redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';

const usernameSchema = z.object({
	username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }).trim()
});

const passwordSchema = z.object({
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' }),
	password2: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});

async function validateUrlParams(event: ServerLoadEvent | RequestEvent) {
	const tokenParam = event.url.searchParams.get('token');
	const userIDParam = event.url.searchParams.get('userID');

	if (!tokenParam) throw error(400, { message: 'Token not found' });
	if (!userIDParam) throw error(400, { message: 'UserID not found' });
	const user = await db.getUniqueUserByUserID(userIDParam);
	if (!user) throw error(400, { message: 'User does not exist' });

	const valid = await db.validateResetToken(userIDParam, tokenParam);
	if (!valid) throw error(400, { message: 'Invalid token' });

	return { userIDParam, tokenParam, user };
}

export async function load(event) {
	const { userIDParam, tokenParam } = await validateUrlParams(event);

	const usernameForm = await superValidate(event, usernameSchema);
	const passwordForm = await superValidate(event, passwordSchema);
	return { usernameForm, passwordForm, tokenParam, userIDParam };
}

export const actions = {
	async username(event) {
		const { userIDParam, user } = await validateUrlParams(event);

		const form = await superValidate(event, usernameSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.username === user.username) return setError(form, 'username', 'Username has not changed');

		const usernameExists = await db.getUniqueUserByUsername(form.data.username);
		if (usernameExists) return setError(form, 'username', 'Username taken');

		await db.updateUsername(userIDParam, form.data.username);

		throw redirect(303, '/auth/login');
	},

	async password(event) {
		const { userIDParam, user } = await validateUrlParams(event);

		const form = await superValidate(event, passwordSchema);
		if (!form.valid) return fail(400, { form });

		if (form.data.password !== form.data.password2) return setError(form, 'password2', 'Passwords do not match');

		if (await bcrypt.compare(form.data.password, user.password))
			return setError(form, 'password', 'Password has not changed');

		await db.updatePassword(userIDParam, form.data.password);

		throw redirect(303, '/auth/login');
	}
};
