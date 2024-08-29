import { Box } from "@chakra-ui/react";
import OrganizationView from "@/app/(web)/sysadmin/organizations/components/OrganizationView";
import { redirect, useRouter } from "next/navigation";
import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { OrganizationController } from "@services/server/organizations/Organization.controller";
import { UserService } from "@services/server/users/User.service";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";

async function OrganizationPage({ params }: { params: { id: string } }) {
  const userService = inversifyServerContainer.get(UserService);
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
