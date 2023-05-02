import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
	if (!locals.user) throw redirect(302, '/login');

	const user = await db.user.findUnique({
		where: { userID: params.userID },
		include: { reports: true }
	});
	if (!user) throw error(404, { message: 'User not found' });

	return { user };
}

export const actions = {
	async toggleAdmin({ params }) {
		const user = await db.user.findUnique({
			where: { userID: params.userID },
			include: { reports: true }
		});
		if (!user) return fail(404, { message: 'User not found' });

		await db.user.update({
			where: {
				userID: user.userID
			},
			data: {
				admin: user.admin ? false : true
			}
		});
		return { status: 200 };
	},
	async deleteReport({ url }) {
		const reporterID = url.searchParams.get('reporterID');
		const culpritID = url.searchParams.get('culpritID');

		if (!reporterID || !culpritID) return fail(400);

		try {
			await db.report.delete({
				where: {
					reporterID_culpritID: {
						reporterID,
						culpritID
					}
				}
			});
		} catch (error) {
			return fail(500, { error });
		}
		return { status: 200 };
	}
};
