"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { prismaService } from "@services/server/PrismaService";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { jwtClaimsService } from "@services/server/JwtClaims/JwtClaims.service";

export async function postForm(formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  console.log({ code, email });
  await loginUser({ code, email });
  redirect("/auth/email/code");
}

export const loginUser = actionClient
  .schema(
    z.object({
      email: z.string(),
      code: z.string(),
    }),
  )
  .action(async ({ parsedInput: { email, code } }) => {
    console.log("COCO");

    //first, does the code match?
    const emailCode = await prismaService.client.emailCode.findFirst({
      where: {
        email,
        code,
      },
    });
    if (false && !emailCode) {
      console.log("bad");
      return {
        error: "Invalid code",
      };
    }

    //then, find the user
    const user = await prismaService.client.user.findFirst({
      where: {
        email,
      },
    });

    //if the user exists, does NOT have verified email, get mad
    if (user && !user.emailVerified) {
      // return {
      //   error: "Invalid email",
      // };
    }
    //if the user exists, set the session

    if (user) {
      const session = await lucia.createSession(user!.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      console.log("SETTED");
      return { success: true };
    } else {
      console.log("CREATING NEW CLAIM");
      jwtClaimsService.setNewUserClaim({
        provider: "email",
        email,
      });
      return { redirect: "/auth/new-user" };
    }
  });
