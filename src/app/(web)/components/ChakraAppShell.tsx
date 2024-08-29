import ChakraAppShellClient from "@/app/(web)/components/ChakraAppShell/ChakraAppShell.Client";
import { userService } from "@services/server/users/User.service";
import { organizationService } from "@services/server/organizations/Organization.service";
import { UserDropdownProps } from "@/app/(web)/components/ChakraAppShell/UserDropdown";

export default async function ChakraAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await userService.getCurrentUser();

  const status = user ? "authenticated" : "unauthenticated";

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
