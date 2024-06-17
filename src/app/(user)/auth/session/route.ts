import { lucia, validateRequest } from "@/app/lib/auth";

export async function GET() {
  const session = await validateRequest();
  const sessionCookieName = lucia.sessionCookieName;
  return Response.json({ ...session, sessionCookieName });
}
