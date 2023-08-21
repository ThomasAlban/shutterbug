import db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { ImgurClient } from 'imgur';
import { IMGUR_CLIENT_ID } from '$env/static/private';

export async function load({ locals }) {
	const currentDate = new Date();
	const theme = await db.theme.findFirst({
		where: {
			dateStart: {
				lt: currentDate
			},
			dateEnd: {
				gt: currentDate
			}
		}
	});
	if (!theme) {
		throw redirect(303, '/app/home');
	}
	const alreadySubmitted = await db.photo.findMany({
		where: { userID: locals.user?.userID, themeID: theme.themeID }
	});
	if (alreadySubmitted.length > 0) return { theme, alreadySubmitted: true };

	return { theme, alreadySubmitted: false };
}

export const actions = {
	async upload({ request, locals }) {
		// get the current theme in the bounds of the current date
		const currentDate = new Date();
		const theme = await db.theme.findFirst({
			where: {
				dateStart: {
					lt: currentDate
				},
				dateEnd: {
					gt: currentDate
				}
			}
		});
		if (!theme) {
			return fail(500, { message: 'no theme found' });
		}
		const alreadySubmitted = await db.photo.findMany({
			where: { userID: locals.user?.userID, themeID: theme.themeID }
		});
		if (alreadySubmitted.length > 0) {
			return fail(400, { message: 'already submitted' });
		}

		const formData = Object.fromEntries(await request.formData());
		if (!formData) return fail(400, { message: 'no data' });

		if (!(formData.image as File).name || (formData.image as File).name === 'undefined') {
			return fail(400, { message: 'You must provide a file to upload' });
		}
		const img = formData.image as File;

		// check that the image is not larger than 10MB (arbitrary)
		if (img.size > 10_000_000) return fail(400, { message: 'file size too large' });

		// convert the image to a base64 string so that it can be uploaded
		const imgBase64 = Buffer.from(await img.arrayBuffer()).toString('base64');

		// create a new instance of the imgur client
		const imgurClient = new ImgurClient({
			clientId: IMGUR_CLIENT_ID
		});

		// upload the image to imgur
		const res = await imgurClient.upload({
			image: imgBase64,
			type: 'base64'
		});
		// validate to make sure the upload was successful
		if (!res.success) return fail(500, { message: 'server error' });

		try {
			await db.photo.create({
				data: {
					// connect this entry with the current logged-in user
					user: {
						connect: {
							username: locals.user?.username
						}
					},
					// add the current theme
					theme: {
						connect: {
							themeID: theme.themeID
						}
					},
					photo: res.data.link
				}
			});
		} catch (error) {
			return fail(500, { message: error as string });
		}

		return { success: true };
	}
};
