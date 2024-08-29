"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { organizationController } from "@services/server/organizations/Organization.controller";

export const updateOrganizationAction = actionClient
  .schema(
    z.object({ slug: z.string().optional(), name: z.string().optional() }),
  )
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(
    async ({ parsedInput: { slug, name }, bindArgsParsedInputs: [id] }) => {
      try {
        const data: Prisma.OrganizationUpdateInput = {
          slug,
          name,
          updatedAt: new Date(),
        };

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
        revalidatePath("/sysadmin/organizations");
        return { success: true };
      } catch (e: any) {
        return { errorMsg: e?.message ?? e };
      }
    },
  );

export const createOrganizationAction = actionClient
  .schema(
    z.object({ slug: z.string().optional(), name: z.string().optional() }),
  )
  .action(async ({ parsedInput }) => {
    const { slug, name } = parsedInput;

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

    try {
      await organizationController.createOrganization(data);
    } catch (e: any) {
      //Prisma P2002 is "unique constraint failed"
      if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
        return {
          errors: { slug: "Slug must be unique" },
          errorMsg: "Please fix the following errors",
        };
      }
      return { errorMsg: e?.message ?? e };
    }
    revalidatePath("/sysadmin/organizations");
    return { success: true };
  });

export const archiveOrganization = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    await organizationController.archiveOrganization(id);
    revalidatePath(`/admin/organizations`);
    return { success: true };
  });
