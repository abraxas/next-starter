import { OrganizationController } from "@services/server/organizations/Organization.Controller";
import { serverContainer } from "@services/serverContainer";

export async function GET() {
  const organizationController = serverContainer.get(OrganizationController);
  return organizationController
    .getOrganizations()
    .then((x) => Response.json(x));
}
