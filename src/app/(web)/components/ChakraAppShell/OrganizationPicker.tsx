"use client";

import {
  Box,
  Button,
  Divider,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Organization } from "@prisma/client";
import {
  getCurrentOrganization,
  setCurrentOrganization,
} from "@/app/(web)/components/ChakraAppShell/actions";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export type OrganizationPickerProps = {
  organizations: Array<Organization>;
};

export default function OrganizationPicker(props: OrganizationPickerProps) {
  const { organizations } = props;
  const router = useRouter();

  const { data: currentOrganization } = useSuspenseQuery({
    queryKey: ["currentOrganization"],
    queryFn: () => getCurrentOrganization(),
  });
  console.log("REFRFSH ORG PICKER " + currentOrganization?.id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<string | number | undefined>(
    currentOrganization?.id,
  );
  const [search, setSearch] = useState("");

  const filteredOrganizations = useMemo(
    () =>
      organizations.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()),
      ),
    [organizations, search],
  );

  const selectedOrganization = organizations.find(
    (item) => item.id === selectedItem,
  );

  useEffect(() => {
    if (currentOrganization?.id !== null) {
      setSelectedItem(currentOrganization?.id);
    }
  }, [currentOrganization?.id]);

  async function handleItemClick(value: string) {
    setSelectedItem(value);
    await setCurrentOrganization(value);
    onClose();
  }
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="top-end"
    >
      <PopoverTrigger>
        <Box display="flex" alignItems="center" cursor="pointer" ml={2}>
          {selectedOrganization?.name || "Select organization"}
          <Icon as={FaChevronDown} ml={2} />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Stack>
            {organizations.length > 5 && (
              <InputGroup>
                <Input
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputRightElement mr={2}>
                  <Button variant="ghost" onClick={() => setSearch("")}>
                    Clear
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
            <List spacing={2}>
              {filteredOrganizations.map((item, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleItemClick(item.id)}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>{item.name}</Box>
                  {item.id === selectedItem && (
                    <Icon as={FaCheck} color="green.500" />
                  )}
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box ml={2}>
              <Button
                leftIcon={<FaPlus />}
                variant="link"
                colorScheme="blue"
                onClick={() => {
                  onClose();
                  router.push("/organizations/create");
                }}
              >
                Create Organization
              </Button>
            </Box>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
