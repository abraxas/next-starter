import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/User.controller";

export async function GET() {
  const userController = serverContainer.get(UserController);
  const response = await userController.getSession();
  return Response.json(response);
}
