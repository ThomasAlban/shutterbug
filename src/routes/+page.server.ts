import prisma from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

// this function runs when the page loads
export const load: PageServerLoad = async () => {
  return {
    // get all users and return them for use in +page.svelte
    // this is equivalent to running SELECT * FROM users;
    users: await prisma.user.findMany(),
  };
};
