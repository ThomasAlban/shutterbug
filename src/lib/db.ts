// import the Pool object from the node-postgres library, 
// which is used to connect to the database
import { Pool } from 'pg';
// function from the 'fs' library which I will use to read the root.crt file
import { readFileSync } from 'fs';
// instead of hardcoding the database connection string, we use an environment variable 
import { DB_CONN_STRING } from '$env/static/private';

// the configuration for the connection to the database
const config = {
    connectionString: DB_CONN_STRING,
    ssl: {
        rejectUnauthorized: false,
        // a root.crt file must be placed in the root of the project
        // this is read to authenticate access to the database
        ca: readFileSync('root.crt').toString(),
    },
}

// create a connection pool
// which means we only establish a connection to the database once, speeding up the app
const pool = new Pool(config);

// export a function to connect to the database
export const connectToDB = async () => await pool.connect();