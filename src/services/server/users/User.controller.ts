import "reflect-metadata";

import { injectable } from "inversify";
import { UserService } from "@services/server/users/User.service";
import { omit } from "@/lib/util/objects";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async getSession() {
    console.log("OI");
    return this.userService.getUserSession();
  }

  async getCurrentUser() {
    const user = await this.userService.getCurrentUser();
    return user;
  }
}
