import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const user = await db.user.findUnique({
		// get the user from the database whose uuid is the same as the one in the url
		where: { userID: params.userID },
		// include that user's reports and who has reported them
		include: { reports: true, reportedBy: true }
	});
	if (!user) throw error(404, { message: 'User not found' });

	return { user };
}

export const actions = {
	// runs when the toggle admin button is pressed
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
	// runs when the delete report button is pressed
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
	},
	// runs when the delete user button is pressed
	async deleteUser({ params }) {
		try {
			await db.user.delete({
				where: {
					userID: params.userID
				}
			});
		} catch (error) {
			return fail(500, { error });
		}
		// redirect them because the user no longer exists
		throw redirect(303, '/admin/home');
	}
};
