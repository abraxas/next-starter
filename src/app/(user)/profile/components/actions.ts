"use server";

import { User } from "@prisma/client";

export async function onSubmitAction(state: Partial<User>) {
  console.log("THIS IS ON THE SERVER");
  return { success: 1 };
}
