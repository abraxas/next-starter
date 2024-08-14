"use server";

import { logout as authLogout } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  await authLogout();
  revalidatePath("/", "layout");
}
