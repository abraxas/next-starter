import { organizationController } from "@services/server/organizations/Organization.controller";

export async function GET() {
  return organizationController
    .getOrganizations()
    .then((x) => Response.json(x));
}
