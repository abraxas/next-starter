import { OrganizationController } from "@services/server/organizations/Organization.controller";
import { inversifyServerContainer } from "@services/inversifyServerContainer";

export async function GET() {
  const organizationController = inversifyServerContainer.get(
    OrganizationController,
  );
  return organizationController
    .getOrganizations()
    .then((x) => Response.json(x));
}
