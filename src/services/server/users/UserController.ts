import "reflect-metadata";

import { injectable } from "inversify";
import { UserService } from "@services/server/users/UserService";
import { lucia } from "@/lib/auth";
import { omit } from "@/lib/util/objects";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async getSession() {
    const session = await this.userService.getUserSession();
    const rawUser = await this.userService.getCurrentUser();

    if (!rawUser) {
      throw new Error("Invalid user session.");
    }

    const isAdmin = this.userService.isAdmin(rawUser);
    const user = {
      ...omit(rawUser, "adminUser" as keyof typeof rawUser),
      isAdmin,
    };
    const sessionCookieName = lucia.sessionCookieName;
    return Response.json({ ...session, user, sessionCookieName });
  }
}
