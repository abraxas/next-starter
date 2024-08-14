import { serverContainer } from "@services/serverContainer";
import { UserService } from "@services/server/users/User.Service";
import { redirect } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";
import { GuardError } from "@/lib/types/errors";

export default async function adminGuard() {
  const userService = serverContainer.get(UserService);
  try {
    await userService.assertCurrentUserIsAdmin();
  } catch (e: any) {
    throw new GuardError(e.message);
  }
}

export function adminGuardRedirect(url: string = "/") {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => {}) => {
    try {
      await adminGuard();
    } catch (e: any) {
      if (e instanceof GuardError) {
        return redirect(url);
      }
      throw e;
    }
  };
}
