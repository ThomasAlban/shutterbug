/* eslint-disable no-var */
import type { PrismaClient } from '@prisma/client';
import type { jwtUser } from '$lib/server/jwt';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			user?: {
				userID: string;
				username: string;
				admin: boolean;
			};
		}
	}
	var db: PrismaClient;
}

export {};
