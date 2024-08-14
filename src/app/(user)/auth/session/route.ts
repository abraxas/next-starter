import { serverContainer } from "@services/serverContainer";
import { UserController } from "@services/server/users/User.controller";

export async function GET() {
  console.log("GSES");
  const userController = serverContainer.get(UserController);
  console.log("GSESD");
  const response = await userController.getSession();
  console.log(response);
  return Response.json(response);
}
