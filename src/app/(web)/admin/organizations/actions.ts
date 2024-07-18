"use server";

import { serverContainer } from "@services/serverContainer";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import { id } from "inversify";
import { Prisma } from "@prisma/client";

export async function updateOrganization(
  id: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const data: Prisma.OrganizationUpdateInput = {
      slug: formData.get("slug")?.toString(),
      name: formData.get("name")?.toString(),
      updatedAt: new Date(),
    };

    const organizationController = serverContainer.get(OrganizationController);
    const previousOrganization =
      await organizationController.getOrganizationById(id);
    if (!previousOrganization) throw new Error("Organization not found");

    const errors: Record<string, string> = {};
    if (!data.slug) errors["slug"] = "Slug is required";
    if (data.slug && data.slug !== previousOrganization.slug) {
      errors["slug"] = "Slug cannot be changed";
    }
    if (!data.name) errors["name"] = "Name is required";
    if (Object.keys(errors).length)
      return { errors, errorMsg: "Please fix the following errors" };

    if (!id) throw new Error("id is required");

    await organizationController.updateOrganization(id, data);
    return { success: true };
  } catch (e: any) {
    return { errorMsg: e?.message ?? e };
  }
}

export async function createOrganization(prevState: any, formData: FormData) {
  const slug = formData.get("slug")?.toString();
  const name = formData.get("name")?.toString();

  const errors: Record<string, string> = {};
  if (!slug) errors["slug"] = "Slug is required";
  if (!name) errors["name"] = "Name is required";
  if (Object.keys(errors).length)
    return { errors, errorMsg: "Please fix the following errors" };

  const data: Prisma.OrganizationCreateInput = {
    slug: slug!,
    name: name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const organizationController = serverContainer.get(OrganizationController);
  await organizationController.createOrganization(data);
  return { success: true };
}

export async function archiveOrganization(id: string) {
  const organizationController = serverContainer.get(OrganizationController);
  await organizationController.archiveOrganization(id);
  return { success: true };
}
