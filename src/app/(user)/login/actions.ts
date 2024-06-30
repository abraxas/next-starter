"use server";

import { ActionResult } from "next/dist/server/app-render/types";
import { lucia } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverContainer } from "@/services/serverContainer";
import { PrismaService } from "@/services/server/prisma";
import { TYPES } from "@/services/types";

const prismaService = serverContainer.get<PrismaService>(TYPES.PrismaService);
const db = prismaService.client;

export async function login(
  foo: any,
): Promise<ActionResult & { error?: string }> {
  const email = foo.get("email");
  const password = foo.get("password");

  const username = email;

  const existingUser = await db.user.findFirst({
    where: {
      email: username,
    },
  });

  if (!existingUser) {
    return {
      error: "Incorrect email or password",
    };
  }
  const validPassword = true;
  if (!validPassword) {
    return {
      error: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingUser?.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
