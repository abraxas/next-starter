"use client";

import { User } from "@prisma/client";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { logout } from "@/app/(web)/components/Nav/actions";
import { FiChevronDown } from "react-icons/fi";

export type UserDropdownProps = {
  user: User | null;
  //organizations: Array<Organization>;
  //currentOrganization?: Organization;
  //handleOrganizationPickerChange: () => void;
};
export default function UserDropdown({
  user,
  //organizations,
  //currentOrganization,
  //handleOrganizationPickerChange,
}: UserDropdownProps) {
  return (
    <Flex alignItems={"center"}>
      <Spacer w={5} />
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
          <HStack>
            <Avatar size={"sm"} src={user?.image || ""} />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm">{user?.name ?? user?.email}</Text>
              {/*<Text fontSize="xs" color="gray.600">*/}
              {/*  Admin*/}
              {/*</Text>*/}
            </VStack>
            <Box display={{ base: "none", md: "flex" }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          bg={useColorModeValue("white", "gray.900")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => logout()}>Sign out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
