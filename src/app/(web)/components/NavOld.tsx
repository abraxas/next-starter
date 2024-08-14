import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Spacer,
} from "@chakra-ui/react";
import { signIn, signOut } from "@/lib/auth";
import NavResponsiveWrapper from "@/app/(web)/components/NavResponsiveWrapper";
import { auth } from "@/lib/auth";
import NavLink from "@/app/(web)/components/NavLink";
import { revalidatePath } from "next/cache";
import { serverContainer } from "@services/serverContainer";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import NavOrganizationDropdown from "@/app/(web)/components/NavOrganizationDropdown";

interface Props {
  children: React.ReactNode;
}

const links = ["Dashboard", "Projects", "Team"];

export default async function NavOld() {
  const session = await auth();
  const user = session?.user;
  const status = session ? "authenticated" : "unauthenticated";

  const organizationService = serverContainer.get(OrganizationService);
  const organizations = await organizationService.getOrganizations();
  const currentOrganization =
    await organizationService.getCurrentOrganization();
  console.log({ organizations, currentOrganization });

  async function handleOrganizationPickerChange(organizationId: string) {
    "use server";
    const organizationService = serverContainer.get(OrganizationService);
    await organizationService.setCurrentOrganization(organizationId);
    revalidatePath("/");
  }

  async function logout() {
    "use server";
    await signOut();
    revalidatePath("/");
  }

  async function login() {
    "use server";
    await signIn();
  }

  return (
    <>
      <NavResponsiveWrapper links={links}>
        <>
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          {!!user ? (
            <Flex alignItems={"center"}>
              <Box>
                <NavOrganizationDropdown
                  organizations={organizations}
                  currentOrganization={currentOrganization}
                  onChange={async (organizationId: string) => {
                    "use server";
                    const organizationService =
                      serverContainer.get(OrganizationService);
                    await organizationService.setCurrentOrganization(
                      organizationId,
                    );
                    revalidatePath("/");
                  }}
                />
              </Box>
              <Spacer w={5} />
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={user?.image || ""} />
                </MenuButton>
                <MenuList>
                  <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <form action={logout}>
                    <MenuItem type="submit">Log Out</MenuItem>
                  </form>
                </MenuList>
              </Menu>
            </Flex>
          ) : null}
          {status === "unauthenticated" ? (
            <form action={login}>
              <Button colorScheme={"green"} variant={"solid"} type="submit">
                Sign in
              </Button>
            </form>
          ) : null}
        </>
      </NavResponsiveWrapper>
    </>
  );
}
