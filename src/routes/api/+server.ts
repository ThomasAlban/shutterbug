/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
    let dbconn = locals.dbconn;

    let results = await dbconn.query('SELECT * FROM users');

    return new Response(JSON.stringify(results.rows));
}