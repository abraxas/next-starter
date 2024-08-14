import "reflect-metadata";

import { injectable } from "inversify";
import { UserService } from "@services/server/users/User.service";
import { omit } from "@/lib/util/objects";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async getCurrentUser() {
    const user = await this.userService.getCurrentUser();
    return user;
  }
}
