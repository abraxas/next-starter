"use client";

import React from "react";
import OrganizationForm from "@/app/(web)/admin/organizations/components/OrganizationForm";
import { Organization } from "@prisma/client";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useToggle } from "@/lib/util/hooks";
import Link from "next/link";

export default function OrganizationView({
  organization,
  id,
}: {
  organization: Organization;
  id: string;
}) {
  const {
    value: readonly,
    disable: onEditClicked,
    enable: enableReadonly,
  } = useToggle(true);

  return (
    <Stack spacing={3}>
      <OrganizationForm
        initialData={organization as any}
        id={id}
        readonly={readonly}
        onCancel={enableReadonly}
        onSuccess={enableReadonly}
      />

      {readonly && (
        <Stack spacing={3} direction="row">
          <Button onClick={onEditClicked}>Edit</Button>
          <Button colorScheme="red">Archive</Button>
          <Link href={"/admin/organizations"}>
            <Button>Back</Button>
          </Link>
        </Stack>
      )}
    </Stack>
  );
}
