import { Box } from "@chakra-ui/react";
import OrganizationView from "@/app/(web)/sysadmin/organizations/components/OrganizationView";
import { redirect } from "next/navigation";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";
import { userService } from "@services/server/users/User.service";
import { organizationAdminController } from "@services/server/organizations/Organization.Admin.controller";

async function OrganizationPage({ params }: { params: { id: string } }) {
  await userService.redirectIfNotAdmin();

  const organization = await organizationAdminController.getOrganizationById(
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
