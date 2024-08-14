import { UserService } from "@services/server/users/User.Service";
import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/User.Controller";

export async function GET() {
  const userService = serverContainer.get(UserService);
  return userService.getCurrentUser().then((x) => Response.json(x));
}
