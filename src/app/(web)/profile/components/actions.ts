"use server";

import { User } from "@prisma/client";
import { UserFormDataSchema } from "@/lib/models/validators/User";
import { UserService } from "@services/server/users/User.service";
import { serverContainer } from "@services/serverContainer";

export async function onSubmitAction(state: {}, formData: FormData) {
  const userService = serverContainer.get(UserService);
  //convert FormData to a Partial<user>

  const userPartial = UserFormDataSchema.parse(formData);

  await userService.updateCurrentUser(userPartial);

  console.log("THIS IS ON THE SERVER");
  console.log({ state, userPartial });
  return { success: 1 };
}
