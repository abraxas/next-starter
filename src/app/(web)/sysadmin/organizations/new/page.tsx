import { serverContainer } from "@services/serverContainer";
import { Box } from "@chakra-ui/react";
import OrganizationForm from "@/app/(web)/sysadmin/organizations/components/OrganizationForm";
import { UserService } from "@services/server/users/User.service";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";

async function NewOrganizationPage() {
  const userService = serverContainer.get(UserService);
  await userService.redirectIfNotAdmin();
  return (
    <Box>
      <OrganizationForm />
    </Box>
  );
}
export default withAdminGuard(NewOrganizationPage);
