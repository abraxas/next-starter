import ChakraAppShellClient from "@/app/(web)/components/ChakraAppShell/ChakraAppShell.Client";
import { serverContainer } from "@services/serverContainer";
import { UserService } from "@services/server/users/User.service";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { UserDropdownProps } from "@/app/(web)/components/ChakraAppShell/UserDropdown";
import {
  FiCompass,
  FiHome,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

export default async function ChakraAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const userService = serverContainer.get(UserService);
  const user = await userService.getCurrentUser();

  const status = user ? "authenticated" : "unauthenticated";

  const organizationService = serverContainer.get(OrganizationService);
  const organizations = await organizationService.getOrganizations();
  const currentOrganization =
    await organizationService.getCurrentOrganization();

  const userDropdownProps: UserDropdownProps = {
    user,
    //organizations,
    //currentOrganization,
    //handleOrganizationPickerChange: async () => {
    //  await organizationService.setCurrentOrganization;
    //},
  };

  return (
    <ChakraAppShellClient userDropdownProps={userDropdownProps}>
      {children}
    </ChakraAppShellClient>
  );
}
