import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import NavLink from "@/app/(web)/components/NavLink";

type MenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children: ChildMenuLink[];
};
type ChildMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

interface NavResponsiveWrapperProps {
  links: MenuLink[];
  children: React.ReactNode;
}

const NavResponsiveWrapper: React.FC<NavResponsiveWrapperProps> = ({
  links,
  children,
}) => {
  return (
    <Box>
      <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
        {links.map((link) => (
          <NavLink key={link.label} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </HStack>
      {children}
    </Box>
  );
};

export default NavResponsiveWrapper;
