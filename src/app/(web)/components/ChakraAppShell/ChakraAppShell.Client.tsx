"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Heading,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import UserDropdown, {
  UserDropdownProps,
} from "@/app/(web)/components/ChakraAppShell/UserDropdown";
import { login } from "@/app/(web)/components/Nav/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface NavItemProps extends FlexProps {
  icon?: IconType;
  active?: boolean;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  userDropdownProps: UserDropdownProps;
  onOpen: () => void;
}

type LinkItemProps = {
  type?: string;
  name: string;
  icon?: IconType;
  href?: string;
};

interface SidebarProps extends BoxProps {
  linkItems: Array<LinkItemProps>;
  onClose: () => void;
}

const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarProps) => {
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
          Cashcard
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {linkItems.map((link) => (
        <>
          {link.type === "header" ? (
            <Heading size="md" p={2} pl={5}>
              {link.name}
            </Heading>
          ) : (
            <Link href={link.href ?? ""}>
              <NavItem
                key={link.name}
                icon={link.icon}
                active={isActive(link.href ?? "")}
              >
                {link.name}
              </NavItem>
            </Link>
          )}
        </>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, active, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
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
  );
};

const MobileNav = ({ onOpen, userDropdownProps, ...rest }: MobileProps) => {
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
        Cashcard
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        {userDropdownProps.user ? (
          <UserDropdown {...userDropdownProps} />
        ) : (
          <form action={login}>
            <Button colorScheme={"green"} variant={"solid"} type="submit">
              Sign in
            </Button>
          </form>
        )}
      </HStack>
    </Flex>
  );
};

export type ChakraAppShellClientProps = {
  children: React.ReactNode;
  userDropdownProps: UserDropdownProps;
};
const ChakraAppShellClient = ({
  children,
  userDropdownProps,
}: ChakraAppShellClientProps) => {
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
  const linkItems = window.location.pathname.startsWith("/sysadmin")
    ? sysadminLinkItems
    : baseLinkItems;

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        linkItems={linkItems}
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
          <SidebarContent linkItems={linkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} userDropdownProps={userDropdownProps} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default ChakraAppShellClient;
