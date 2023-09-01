import * as db from '$lib/server/db';
import type { User } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const searchSchema = z.object({
	search: z.string({ required_error: 'Search cannot be empty' }).min(1, { message: 'Search cannot be empty' }).trim(),
	searchBy: z.enum(['username', 'userID'])
});

export async function load(event) {
	const form = await superValidate(event, searchSchema);
	return { form };
}

export const actions = {
	async default(event) {
		const form = await superValidate(event, searchSchema);
		if (!form.valid) return fail(400, { form });

		let users: User[];
		if (form.data.searchBy === 'username') {
			users = await db.adminSearchUsersByUsername(form.data.search);
		} else {
			users = await db.adminSearchUsersByUserID(form.data.search);
		}
		return { form, users };
	}
};
