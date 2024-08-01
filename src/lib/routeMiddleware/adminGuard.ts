import { serverContainer } from "@services/serverContainer";
import { UserService } from "@services/server/users/UserService";
import { GuardError } from "@/lib/util/fluentRouteBuilder";
import { redirect } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";

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
