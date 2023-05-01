import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	if (!event.locals.user) throw redirect(302, '/login');
	if (!event.locals.user.admin) throw redirect(302, '/home');
}

export const actions = {
	async default(event) {
		const formData = Object.fromEntries(await event.request.formData());

		if (!formData.text) return fail(400);

		const { text } = formData as {
			text: string;
		};

		const users = await db.user.findMany({
			where: {
				username: { contains: text }
			}
		});

		return { users };
	}
};
