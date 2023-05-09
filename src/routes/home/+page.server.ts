/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function load({ locals }) {
	return { user: locals.user! };
}
