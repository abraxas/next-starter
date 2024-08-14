"use server";
import { signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { serverContainer } from "@services/serverContainer";
import { OrganizationService } from "@services/server/organizations/Organization.service";

export async function logout() {
  "use server";
  await signOut();
  revalidatePath("/");
}

export async function login() {
  "use server";
  await signIn();
}

export async function handleOrganizationPickerChange(organizationId: string) {
  "use server";
  const organizationService = serverContainer.get(OrganizationService);
  await organizationService.setCurrentOrganization(organizationId);
  revalidatePath("/");
}
