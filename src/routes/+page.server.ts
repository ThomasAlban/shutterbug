import * as db from '$lib/server/db';

export async function load(event) {
	// get a random photo submission from the database and send it to the home page
	const submission = await db.getRandomPhotoSubmission();
	return { photo: submission.photo };
}
