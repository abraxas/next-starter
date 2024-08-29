import { userService } from "@services/server/users/User.service";

export class UserController {
  private userService: typeof userService;
  constructor() {
    this.userService = userService;
  }

  async getSession() {
    console.log("OI");
    return this.userService.getUserSession();
  }

  async getCurrentUser() {
    const user = await this.userService.getCurrentUser();
    return user;
  }
}

export const userController = new UserController();
