import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "$env/static/private";

export const load: PageServerLoad = (event) => {
  // If the user is already logged in, redirect them to the home page
  if (event.locals.user) throw redirect(302, "/home");
};

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    if (!formData.username || !formData.password) return fail(400);

    // get the user data from the login form
    const { username, password } = formData as {
      username: string;
      password: string;
    };

    // get the user from the database
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return fail(400);

    // Verify the password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return fail(400);

    const jwtUser = {
      userID: user.userID,
      username: user.username,
    };

    // generate a JWT token, which will be stored on the client and used to authenticate the user
    const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });

    // Set the cookie
    event.cookies.set("AuthorizationToken", `Bearer ${token}`, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    throw redirect(302, "/home");
  },
};
