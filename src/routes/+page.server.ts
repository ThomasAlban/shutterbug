import db from "$lib/server/db";

export async function load() {
  return {
    // get all users and return them for use in +page.svelte
    // this is equivalent to running SELECT * FROM users;
    users: await db.user.findMany(),
  };
}
