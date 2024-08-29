import { UserService } from "@services/server/users/User.service";
import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { UserController } from "@services/server/users/User.controller";

export async function GET() {
  const userService = inversifyServerContainer.get(UserService);
  return userService.getCurrentUser().then((x) => Response.json(x));
}
