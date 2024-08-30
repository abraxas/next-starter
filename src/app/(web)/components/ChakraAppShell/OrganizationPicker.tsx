import { Button, Popover, PopoverTrigger, Select } from "@chakra-ui/react";
import { Organization } from "@prisma/client";

export type OrganizationPickerProps = {
  organizations: Array<Organization>;
  currentOrganization?: Organization | null;
};

export default function OrganizationPicker({
  organizations,
  currentOrganization,
}: OrganizationPickerProps) {
  console.log({ organizations, currentOrganization });
  return (
    <Popover>
      <PopoverTrigger>
        <Button>{currentOrganization?.name || "None"}</Button>
      </PopoverTrigger>
    </Popover>
  );
}
