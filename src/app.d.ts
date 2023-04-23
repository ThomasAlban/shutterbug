// See https://kit.svelte.dev/docs/types#app

import type { PoolClient } from "pg";

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            dbconn: PoolClient;
        }
        // interface PageData {}
        // interface Platform {}

        interface UserRow {
            user_id: string;
            username: string;
            password: string;
            date_created: string;
            profile_photo: string?;
            admin: boolean;
        }
    }
}

export { };
