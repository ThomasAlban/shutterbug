import type { Actions, PageServerLoad } from "../login/$types";
import { fail, redirect } from "@sveltejs/kit";
import db from "$lib/server/db";
import bcrypt from "bcrypt";

export const load: PageServerLoad = (event) => {
  // If the user is already logged in, redirect them to the home page
  if (event.locals.user) throw redirect(302, "/home");
};

// this function runs when the form is submitted
export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    // check to make sure the username and password inputs are valid
    if (
      !formData.username ||
      !formData.password ||
      formData.password != formData.password2
    ) {
      return fail(400);
    }

    // get the username and password out of the formdata object
    const { username, password } = formData as {
      username: string;
      password: string;
    };

    // create a new user
    try {
      await db.user.create({
        data: {
          username,
          // store in the database a hashed version of their password
          password: await bcrypt.hash(password, 10),
        },
      });
    } catch (error) {
      return fail(500, {
        error,
      });
    }

    // Redirect to the login page
    throw redirect(302, "/login");
  },
};
