import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const newUserAction = actionClient
  .schema(
    z.object({
      claim: z.string(),
      user: Prisma.UserCreateInput,
    }),
  )
  .action(async ({ parsedInput: { claim, user } }) => {
    console.log({ claim, user });
    return { user: { id: "1", ...user } };
  });
