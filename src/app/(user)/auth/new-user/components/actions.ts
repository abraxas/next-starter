"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { jwtClaimsService } from "@services/server/JwtClaims/JwtClaims.service";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { userService } from "@services/server/users/User.service";

const UserSchema = z.object({
  email: z.string(),
  name: z.string(),
});

export const newUserAction = actionClient
  .schema(
    z.object({
      claim: z.string(),
      user: UserSchema,
    }),
  )
  .action(async ({ parsedInput: { claim, user } }) => {
    const rawClaim = await jwtClaimsService.getClaimFromCookie();
    const claimData = jwtClaimsService.verifyNewUserClaim(rawClaim);

    if (!claimData || claimData.email != user.email) {
      return {
        error:
          "An unknown error occured.  Please return to the home page and try again.",
      };
    }

    //does the user with this claim already exist?
    const existingUser = await userService.getUserByEmail(claimData.email);
    if (existingUser) {
      return {
        error: "A user with this email already exists.",
      };
    }

    const newUser = await userService.createUser({
      email: user.email,
      name: user.name,
    });

    const session = await lucia.createSession(newUser!.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    console.log({ claim, user });
    return { success: 1, user: newUser, redirect: "/" };
  });
