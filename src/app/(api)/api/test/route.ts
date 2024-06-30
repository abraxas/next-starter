import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // askpermission.for(user).to({ module: 'test', action: 'read', id: '*' });

  return Response.json({ fnord: 32 });
}
