"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  Heading,
} from "@chakra-ui/react";
import {
  FiHome,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
} from "react-icons/fi";
import { IconType } from "react-icons";
import UserDropdown, { UserProps } from "./UserDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Organization, User } from "@prisma/client";
import OrganizationPicker from "./OrganizationPicker";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getCurrentOrganization } from "./actions";
interface NavItemProps extends FlexProps {
  icon?: IconType;
  href?: string;
  active?: boolean;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  user: User | null;
  onOpen: () => void;
}

type LinkItemProps = {
  type?: string;
  name: string;
  icon?: IconType;
  href?: string;
};

function linkToUniqueKey(link: LinkItemProps) {
  return JSON.stringify(link);
}

interface SidebarProps extends BoxProps {
  linkItems: Array<LinkItemProps>;
  onClose: () => void;
  organizations: Array<Organization>;
  currentOrganization?: Organization | null;
}

declare const window: any;

const SidebarContent = ({
  onClose,
  linkItems,
  organizations,
  currentOrganization,
  ...rest
}: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Starter
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Box p={4}>
        <OrganizationPicker organizations={organizations} />
      </Box>
      {linkItems.map((link) => (
        <React.Fragment key={linkToUniqueKey(link)}>
          {link.type === "header" ? (
            <Heading size="md" p={2} pl={5}>
              {link.name}
            </Heading>
          ) : (
            <NavItem
              href={link.href}
              key={link.name}
              icon={link.icon}
              active={isActive(link.href ?? "")}
            >
              {link.name}
            </NavItem>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

const NavItem = ({ href, icon, children, active, ...rest }: NavItemProps) => {
  return (
    <Link href={href || ""}>
      <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          style={{ fontWeight: active ? 700 : 400 }}
          bg={active ? "brand.600" : "transparent"}
          color={active ? "white" : "brand.900"}
          _hover={{
            bg: "brand.200",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};

const MobileNav = ({ onOpen, user, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Starter
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        {user ? (
          <UserDropdown user={user} />
        ) : (
          <Link href="/login">
            <Button colorScheme={"green"} variant={"solid"} type="submit">
              Sign in
            </Button>
          </Link>
        )}
      </HStack>
    </Flex>
  );
};

export type ChakraAppShellClientProps = {
  children: React.ReactNode;
  user: User | null;
  organizations: Array<Organization>;
  //currentOrganization: Organization | null;
};
const ChakraAppShellClient = ({
  children,
  user,
  organizations,
  //currentOrganization,
}: ChakraAppShellClientProps) => {
  const pathname = usePathname();

  const { data: currentOrganization, isLoading } = useSuspenseQuery({
    queryKey: ["currentOrganization"],
    queryFn: () => getCurrentOrganization(),
  });
  console.log("THIS CURRENT IS " + currentOrganization?.id);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const baseLinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome },
    { type: "header", name: "Finance" },
    //    { name: "Finance", icon: FiTrendingUp },
    //    { name: "Links", icon: FiCompass, href: "/finance/links" },
    { name: "Accounts", icon: FiStar, href: "/finance/accounts" },
    { name: "Transactions", icon: FiSettings, href: "/finance/transactions" },
  ];

  const sysadminLinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, href: "/sysadmin" },
    {
      name: "Organizations",
      icon: FiCompass,
      href: "/sysadmin/organizations",
    },
  ];

  //if path starts with /sysadmin, use sysadmin link items
  const linkItems = pathname.startsWith("/sysadmin")
    ? sysadminLinkItems
    : baseLinkItems;

  const bgValue = useColorModeValue("white", "brand.900");

  return (
    <Box minH="100vh" bg={bgValue}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        linkItems={linkItems}
        organizations={organizations}
        currentOrganization={currentOrganization}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            linkItems={linkItems}
            onClose={onClose}
            organizations={organizations}
            currentOrganization={currentOrganization}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} user={user} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default ChakraAppShellClient;
