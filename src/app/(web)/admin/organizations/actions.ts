"use server";

import { serverContainer } from "@services/serverContainer";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import { id } from "inversify";

export async function updateOrganization(id: string, formData: FormData) {
  //const id = formData.get("id").toString();

  console.dir("UDDY");
  const data = {
    slug: formData.get("slug")?.toString(),
    name: formData.get("name")?.toString(),
  };

  if (!id) throw new Error("id is required");

  const organizationController = serverContainer.get(OrganizationController);
  return organizationController.updateOrganization(id, data);
}

export async function createOrganization(formData: FormData) {
  return "TODO";
}
