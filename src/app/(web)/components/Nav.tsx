import { Box } from "@chakra-ui/react";
import { NavContents } from "@/app/(web)/components/Nav/NavContents";
import { auth, signIn, signOut } from "@/lib/auth";
import { serverContainer } from "@services/serverContainer";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { revalidatePath } from "next/cache";

export default async function Nav() {
  const session = await auth();
  const user = session?.user;
  const status = session ? "authenticated" : "unauthenticated";

  const organizationService = serverContainer.get(OrganizationService);
  const organizations = await organizationService.getOrganizations();
  const currentOrganization =
    await organizationService.getCurrentOrganization();

  return (
    <Box>
      <NavContents
        NAV_ITEMS={NAV_ITEMS}
        user={user}
        status={status}
        organizations={organizations}
        currentOrganization={currentOrganization}
      />
    </Box>
  );
}

export type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
};

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Find Work",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Learn Design",
    href: "#",
  },
  {
    label: "Hire Designers",
    href: "#",
  },
];
