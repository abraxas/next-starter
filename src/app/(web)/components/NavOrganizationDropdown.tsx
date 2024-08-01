"use client";

import { Select } from "chakra-react-select";
import { type Organization } from "@prisma/client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

type Props = {
  organizations: Organization[];
  currentOrganization?: Organization;
  onChange: (organizationId: string) => Promise<void>;
};

export default function NavOrganizationDropdown({
  organizations,
  currentOrganization,
  onChange,
}: Props) {
  const pathName = usePathname();

  const organizationOptions = useMemo(() => {
    return organizations.map((organization) => ({
      label: organization.name!,
      value: organization.id!,
    }));
  }, [organizations]);

  async function handleChange(data: { value: string }) {
    await onChange(data.value);
  }

  if (pathName.startsWith("/sysadmin")) {
    return null;
  }

  return (
    <>
      <Select
        name="organizationPicker"
        id="organizationPicker"
        options={organizationOptions}
        value={
          organizationOptions.find(
            (x) => x.value === currentOrganization?.id,
          ) ?? ""
        }
        onChange={handleChange as any}
      />
    </>
  );
}
