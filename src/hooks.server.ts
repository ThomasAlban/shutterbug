import type { Handle } from "@sveltejs/kit";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import prisma from "$lib/server/db";

import { JWT_ACCESS_SECRET } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
  const { headers } = event.request;

  const cookies = parse(headers.get("cookie") ?? "");

  if (cookies.AuthorizationToken) {
    // Remove Bearer prefix
    const token = cookies.AuthorizationToken.split(" ")[1];

    try {
      const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

      if (typeof jwtUser === "string") throw new Error("Something went wrong");

      const user = await prisma.user.findUnique({
        where: {
          userID: jwtUser.userID,
        },
      });

      if (!user) throw new Error("User not found");

      event.locals.user = {
        userID: user.userID,
        username: user.username,
      };
    } catch (error) {
      console.error(error);
    }
  }

  return await resolve(event);
};
