import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/UserController";

export async function GET() {
  const userController = serverContainer.get(UserController);
  return userController.getSession();
}
