import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { DB_CONN_STRING } from '$env/static/private'

const config = {
    connectionString: DB_CONN_STRING,
    ssl: {
        rejectUnauthorized: false,
        // a root.crt file must be placed in the root of the project
        ca: readFileSync('root.crt').toString(),
    },
}

const pool = new Pool(config);

export const connectToDB = async () => await pool.connect();