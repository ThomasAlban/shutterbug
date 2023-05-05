import db from '$lib/server/db';
import type { User } from '@prisma/client';
import { fail } from '@sveltejs/kit';

export const actions = {
	async default({ request }) {
		const formData = Object.fromEntries(await request.formData());

		if (!formData.text || !formData.searchBy) return fail(400);
		const { text } = formData as { text: string };

		let users: User[];

		if (formData.searchBy === 'username') {
			users = await db.user.findMany({
				where: {
					username: { contains: text }
				}
			});
		} else {
			users = await db.user.findMany({
				where: {
					userID: text
				}
			});
		}
		return { users };
	}
};
