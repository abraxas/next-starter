import { Box } from "@chakra-ui/react";
import OrganizationView from "@/app/(web)/sysadmin/organizations/components/OrganizationView";
import { redirect, useRouter } from "next/navigation";
import { serverContainer } from "@services/serverContainer";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import { UserService } from "@services/server/users/UserService";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";

async function OrganizationPage({ params }: { params: { id: string } }) {
  const userService = serverContainer.get(UserService);
  await userService.redirectIfNotAdmin();

  const organizationController = serverContainer.get(OrganizationController);
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
