import type { Handle } from "@sveltejs/kit";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import db from "$lib/server/db";
import { JWT_ACCESS_SECRET } from "$env/static/private";

// this function is run on every request
export const handle: Handle = async ({ event, resolve }) => {
  const { headers } = event.request;

  // get the cookie from the headers of the request
  const cookies = parse(headers.get("cookie") ?? "");

  if (cookies.AuthorizationToken) {
    // Remove Bearer prefix
    const token = cookies.AuthorizationToken.split(" ")[1];

    try {
      // verify that the cookie has not been tampered with
      const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

      if (typeof jwtUser === "string") throw new Error("Something went wrong");

      // check if the user exists
      const user = await db.user.findUnique({
        where: {
          userID: jwtUser.userID,
        },
      });
      if (!user) throw new Error("User not found");

      // set event.locals.user to the user if they do exist
      event.locals.user = {
        userID: user.userID,
        username: user.username,
        // will add more user info to this when and if it is needed
      };
    } catch (error) {
      console.error(error);
    }
  }

  return await resolve(event);
};
