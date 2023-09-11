/* eslint-disable no-var */
import type { PrismaClient } from '@prisma/client';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			user?: jwtUser;
		}
	}
	var db: PrismaClient;
}

export {};
