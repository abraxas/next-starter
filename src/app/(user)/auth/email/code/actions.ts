"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { serverContainer } from "@services/serverContainer";
import { PrismaService } from "@services/server/PrismaService";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      email: z.string().email(),
      code: z.string(),
    }),
  )
  .action(async ({ parsedInput: { email, code } }) => {
    const prismaService = serverContainer.get<PrismaService>(PrismaService);

    console.log("COCO");

    //first, does the code match?
    const emailCode = await prismaService.client.emailCode.findFirst({
      where: {
        email,
        code,
      },
    });
    if (!emailCode) {
      return {
        error: "Invalid code",
      };
    }

    console.log("CODE");

    //then, find the user
    const user = await prismaService.client.user.findFirst({
      where: {
        email,
      },
    });

    console.dir({ code, email, user });

    //if the user exists, does NOT have verified email, get mad
    if (!user || !user.emailVerified) {
      // return {
      //   error: "Invalid email",
      // };
    }
    //if the user exists, set the session

    console.log("YES");

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
    }

    //if user doesn't exist, for now we don't allow anything
    //TODO: User-create page.
    return {
      error: "Invalid email",
    };
  });
