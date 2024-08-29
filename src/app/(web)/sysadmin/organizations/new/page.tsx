import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { Box } from "@chakra-ui/react";
import OrganizationForm from "@/app/(web)/sysadmin/organizations/components/OrganizationForm";
import { userService } from "@services/server/users/User.service";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";

async function NewOrganizationPage() {
  await userService.redirectIfNotAdmin();
  return (
    <Box>
      <OrganizationForm />
    </Box>
  );
}
export default withAdminGuard(NewOrganizationPage);
