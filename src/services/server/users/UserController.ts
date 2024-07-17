import { injectable } from "inversify";
import { UserService } from "@services/server/users/UserService";
import { produce } from "immer";
import { lucia } from "@/lib/auth";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async getSession() {
    const session = await this.userService.getUserSession();
    const rawUser = await this.userService.getCurrentUser();
    const user = produce(
      rawUser,
      (user: typeof rawUser & { isAdmin: boolean }) => {
        if (!user) return;
        const isAdmin = this.userService.isAdmin(user);
        if (user.adminUser) {
          delete user.adminUser;
        }
        user.isAdmin = isAdmin;
      },
    );
    const sessionCookieName = lucia.sessionCookieName;
    return Response.json({ ...session, user, sessionCookieName });
  }
}
