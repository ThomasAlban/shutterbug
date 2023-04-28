import { redirect } from "@sveltejs/kit";

export function load(event) {
  // delete the user's login cookie
  event.cookies.delete("AuthorizationToken");
  // redirect them back to the login page
  throw redirect(302, "/login");
}
