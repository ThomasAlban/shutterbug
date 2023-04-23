/** @type {import('./$types').RequestHandler} */

// temporary test GET function to test whether the database is working
export async function GET({ locals }) {
    // get the db connection from event.locals (which we set in the handle function)
    const dbconn = locals.dbconn;

    const results = await dbconn.query('SELECT * FROM users');

    return new Response(JSON.stringify(results.rows));
}