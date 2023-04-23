import { connectToDB } from '$lib/db';

// this function runs every time the SvelteKit server receives a request
// we are overriding the default handle function to add the 'dbconn' variable to the event.locals
export async function handle({ event, resolve }) {
    const dbconn = await connectToDB();

    event.locals = { dbconn };
    const response = await resolve(event);

    dbconn.release();
    return response;
}