import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { UserController } from "@services/server/users/User.controller";

export async function GET() {
  const userController = inversifyServerContainer.get(UserController);
  const response = await userController.getSession();
  return Response.json(response);
}
