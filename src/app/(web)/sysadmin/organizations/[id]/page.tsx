import { Box } from "@chakra-ui/react";
import OrganizationView from "@/app/(web)/sysadmin/organizations/components/OrganizationView";
import { redirect, useRouter } from "next/navigation";
import { OrganizationController } from "@services/server/organizations/Organization.controller";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";
import { userService } from "@services/server/users/User.service";
import { inversifyServerContainer } from "@services/inversifyServerContainer";

async function OrganizationPage({ params }: { params: { id: string } }) {
  await userService.redirectIfNotAdmin();

  const organizationController = inversifyServerContainer.get(
    OrganizationController,
  );
  const organization = await organizationController.getOrganizationById(
    params.id,
  );

  if (!organization) {
    redirect("/sysadmin/organizations");
  }

  return (
    <Box>
      <OrganizationView organization={organization} id={params.id} />
    </Box>
  );
}
export default withAdminGuard(OrganizationPage);
