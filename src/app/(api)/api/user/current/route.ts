import { UserService } from "@services/server/users/User.service";
import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/User.controller";

export async function GET() {
  const userService = serverContainer.get(UserService);
  return userService.getCurrentUser().then((x) => Response.json(x));
}
