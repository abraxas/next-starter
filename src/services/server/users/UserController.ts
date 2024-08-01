import "reflect-metadata";

import { injectable } from "inversify";
import { UserService } from "@services/server/users/UserService";
import { omit } from "@/lib/util/objects";

@injectable()
export class UserController {
  constructor(private userService: UserService) {}
}
