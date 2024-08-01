"use client";

import React, { useEffect, useState } from "react";
import OrganizationForm from "@/app/(web)/sysadmin/organizations/components/OrganizationForm";
import { Organization } from "@prisma/client";
import { Button, Stack } from "@chakra-ui/react";
import { useToggle } from "@/lib/util/hooks";
import Link from "next/link";
import { archiveOrganization } from "@/app/(web)/sysadmin/organizations/actions";
import { useRouter } from "next/navigation";
import { z } from "zod";

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
  const router = useRouter();

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
          <Button
            onClick={async () => {
              const result = await archiveOrganization({ id });

              if (result?.data?.success) {
                router.push("/sysadmin/organizations");
              }
            }}
            colorScheme="red"
          >
            Archive
          </Button>
          <Link href={"/sysadmin/organizations"}>
            <Button>Back</Button>
          </Link>
        </Stack>
      )}
    </Stack>
  );
}
