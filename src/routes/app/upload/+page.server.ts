import db from '$lib/server/db';
import type { User } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import imgur from 'imgur';

export const actions = {
	async upload({ request }) {
		const formData = await request.formData();

		const img = formData.get('image');

		if (!img) return fail(400);

		// const fileTypes = ['image/png', 'image/jpeg'];
		// if (!fileTypes.includes(img.type)) return fail(400);

		// console.log(img);

		if (!(img instanceof Object) || !img.name) return fail(400);

		console.log(img.name);

		const buffer = Buffer.from(await img.arrayBuffer());

		fs.writeFileSync(`static/${img.name}`, buffer, 'base64');

		// imgur.

		// return { success: true };
	}
};
