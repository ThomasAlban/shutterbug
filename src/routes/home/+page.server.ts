import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = (event) => {
  // If the user is not logged in, redirect them to the login page
  if (!event.locals.user) throw redirect(302, "/login");

  return { user: event.locals.user };
};
