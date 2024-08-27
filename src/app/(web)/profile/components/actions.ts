"use server";

import { User } from "@prisma/client";
import { UserProfileFormDataSchema } from "@/lib/models/validators/User";
import { UserService } from "@services/server/users/User.service";
import { serverContainer } from "@services/serverContainer";
import { ZodError } from "zod";

type FieldErrors = {
  [key: string]: string[];
};
type Errors = {
  fieldErrors: FieldErrors;
  formError: string;
};

type ZodErrorToErrorProps = {
  error: ZodError;
  formError: string;
};
function zodErrorToErrors({ error, formError }: ZodErrorToErrorProps): Errors {
  const fieldErrors: FieldErrors = {};
  error.errors.forEach((err) => {
    if (err.path) {
      fieldErrors[err.path.join(".")] = [err.message];
    }
  });
  return { fieldErrors, formError: formError ?? error.message };
}

export async function onSubmitAction(state: {}, formData: FormData) {
  const userService = serverContainer.get(UserService);
  //convert FormData to a Partial<user>

  const {
    success,
    error,
    data: userPartial,
  } = UserProfileFormDataSchema.safeParse(formData);

  console.log({ error });

  if (!success) {
    return {
      success,
      error: zodErrorToErrors({
        error,
        formError: "There was an error with your submission",
      }),
    };
  }

  await userService.updateCurrentUser(userPartial);

  console.log("THIS IS ON THE SERVER");
  console.log({ state, userPartial });
  return { success: 1 };
}
