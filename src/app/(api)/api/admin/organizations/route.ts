import { organizationAdminController } from "@services/server/organizations/Organization.Admin.controller";

export async function GET() {
  return organizationAdminController
    .getOrganizations()
    .then((x) => Response.json(x));
}
