import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // askpermission.for(user).to({ module: 'test', action: 'read', id: '*' });
  const userData = await db.select().from(user);

  return Response.json({ userData });
}
