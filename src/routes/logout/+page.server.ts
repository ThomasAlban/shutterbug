import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = (event) => {
  event.cookies.delete("AuthorizationToken");
  throw redirect(302, "/login");
};
