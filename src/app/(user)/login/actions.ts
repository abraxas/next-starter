"use server";

import { ActionResult } from "next/dist/server/app-render/types";
import { UserSelectModel } from "@/drizzle/types";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { lucia } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  foo: any,
): Promise<ActionResult & { error?: string }> {
  const email = foo.get("email");
  const password = foo.get("password");

  const username = email;
  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, username))
    .limit(1);
  const existingUser = existingUsers[0];
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
