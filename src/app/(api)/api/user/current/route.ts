import { UserService } from "@services/server/users/UserService";
import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/UserController";

export async function GET() {
  const userService = serverContainer.get(UserService);
  return userService.getCurrentUser().then((x) => Response.json(x));
}
