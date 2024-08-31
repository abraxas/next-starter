"use server";

import { logout as authLogout } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  organizationController,
  OrganizationController,
} from "@services/server/organizations/Organization.controller";
import { cookiesProvider } from "@services/server/cookies/Cookies.provider";
import { cookies } from "next/headers";

export async function getCurrentOrganization() {
  const org = await organizationController.getCurrentOrganization();
  return org ? JSON.parse(JSON.stringify(org)) : null;
}

export async function setCurrentOrganization(organizationId: string) {
  await organizationController.setCurrentOrganization(organizationId);
}
export async function logout() {
  await authLogout();
  revalidatePath("/", "layout");
}
