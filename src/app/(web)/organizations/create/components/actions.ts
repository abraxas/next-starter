"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { organizationAdminController } from "@services/server/organizations/Organization.Admin.controller";
import { revalidatePath } from "next/cache";
import { userService } from "@services/server/users/User.service";
import { setCurrentOrganization } from "@/app/(web)/components/ChakraAppShell/actions";
import { redirect } from "next/navigation";
import { queryClient } from "@/lib/serverQueryClient";

export const createMyOrganizationAction = actionClient
  .schema(
    z.object({ slug: z.string().optional(), name: z.string().optional() }),
  )
  .action(async ({ parsedInput }) => {
    const user = await userService.getCurrentUser();

    if (!user) {
      return { errorMsg: "An unknown error has occurred" };
    }

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
      organizationUsers: {
        create: {
          role: "owner",
          user: {
            connect: {
              id: user.id,
            },
          },
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        },
      },
    };

    try {
      const newOrg = await organizationAdminController.createOrganization(data);
      console.log("SETTING CURRENT ORG");
      await setCurrentOrganization(newOrg.id);
      queryClient.invalidateQueries();
      revalidatePath("/", "layout");
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
    return { success: true };
  });
