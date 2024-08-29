import { userService } from "@services/server/users/User.service";

export async function GET() {
  return userService.getCurrentUser().then((x) => Response.json(x));
}
