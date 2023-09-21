import * as db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const currentTheme = await db.getCurrentTheme();
	if (!currentTheme) throw redirect(303, '/app/home');

	const alreadySubmitted = await db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID);

	return { currentTheme, alreadySubmitted };
}

export const actions = {
	async upload(event) {
		const currentTheme = await db.getCurrentTheme();
		if (!currentTheme) return fail(400, { message: 'No current theme found' });

		const [alreadySubmitted, formData] = await Promise.all([
			db.userAlreadySubmittedPhoto(event.locals.user!.userID, currentTheme.themeID),
			event.request.formData()
		]);
		const form = Object.fromEntries(formData);

		if (alreadySubmitted) return fail(400, { message: 'Already submitted photo for this theme' });
		if (!form) return fail(400, { message: 'No data' });

		if (!(form.image instanceof File) || !(form.image as File).name || (form.image as File).name === 'undefined')
			return fail(400, { message: 'You must provide an image to upload' });

		const img = form.image as File;

		if (img.type.split('/')[0] !== 'image') return fail(400, { message: 'File is not an image' });

		// check that the image is not larger than 10MB (arbitrary)
		if (img.size > 10_000_000) return fail(400, { message: 'Image size too large' });

		console.log('about to submit photo');

		await db.submitPhoto(img, event.locals.user!.userID, currentTheme.themeID);

		return { success: true };
	}
};
