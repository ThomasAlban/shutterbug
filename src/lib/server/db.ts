import { PrismaClient } from "@prisma/client";

// set the prisma variable to the global variable 'prisma' if it exists, if not make a new PrismaClient
const db = global.db || new PrismaClient();

// when in development mode and changes are made SvelteKit refreshes itself. This prevents a new PrismaClient being made in that case
if (process.env.NODE_ENV === "development") global.db = db;

export default db;
