import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) throw redirect(302, '/login');
}

export const actions = {
	async default({ request }) {
		const formData = Object.fromEntries(await request.formData());

		if (!formData.text) return fail(400);

		const { text } = formData as { text: string };

		const users = await db.user.findMany({
			where: {
				username: { contains: text }
			}
		});

		return { users };
	}
};
