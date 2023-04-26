import type { Actions, PageServerLoad } from "../login/$types";
import { fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import bcrypt from "bcrypt";

export const load: PageServerLoad = (event) => {
  // If the user is already logged in, redirect them to the home page
  if (event.locals.user) throw redirect(302, "/home");
};

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    if (!formData.username || !formData.password) return fail(400);

    const { username, password } = formData as {
      username: string;
      password: string;
    };

    // Create a new user
    try {
      await prisma.user.create({
        data: {
          username,
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
