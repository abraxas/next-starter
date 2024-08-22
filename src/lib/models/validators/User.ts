import { User } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PartialUserSchema = UserSchema.partial();

export const UserFormDataSchema = zfd
  .formData(PartialUserSchema)
  .transform((x) => x as Partial<User>);
