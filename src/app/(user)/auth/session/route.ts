import { userController } from "@services/server/users/User.controller";

export async function GET() {
  const response = await userController.getSession();
  return Response.json(response);
}
