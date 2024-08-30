"use server";

import { logout as authLogout } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrganizationController } from "@services/server/organizations/Organization.controller";
import { cookiesProvider } from "@services/server/cookies/Cookies.provider";

export async function getCurrentOrganization() {
  console.log("GCO!!!");
  const organizationController = new OrganizationController({
    cookieProvider: cookiesProvider,
  });
  return organizationController.getCurrentOrganization();
}
export async function logout() {
  await authLogout();
  revalidatePath("/", "layout");
}
