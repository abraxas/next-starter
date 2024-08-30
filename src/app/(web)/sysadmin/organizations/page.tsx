import React from "react";
import Link from "next/link";
import { Button, Heading, Stack } from "@chakra-ui/react";
import OrganizationTable from "@/app/(web)/sysadmin/organizations/components/OrganizationTable";
import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";
import { organizationAdminController } from "@services/server/organizations/Organization.Admin.controller";

async function OrganizationPage() {
  const organizations = await organizationAdminController.getOrganizations();
  return (
    <div>
      <Heading size="lg">Organizations</Heading>
      <Stack spacing={3}>
        <OrganizationTable organizations={organizations} />
        <Stack spacing={3} direction="row">
          <Link href={"/sysadmin/organizations/new"}>
            <Button colorScheme="blue">Add Organization</Button>
          </Link>
        </Stack>
      </Stack>
    </div>
  );
}
export default withAdminGuard(OrganizationPage);
