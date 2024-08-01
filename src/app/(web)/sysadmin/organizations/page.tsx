import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import AppTable from "@/app/(web)/components/table/Table";
import React from "react";
import Link from "next/link";
import { Button, Heading, Stack } from "@chakra-ui/react";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import { serverContainer } from "@services/serverContainer";
import OrganizationTable from "@/app/(web)/sysadmin/organizations/components/OrganizationTable";
import { routeBuilder } from "@/lib/util/fluentRouteBuilder";
import adminGuard from "@/lib/routeMiddleware/adminGuard";
import { adminRouteBuilder } from "@/lib/routeBuilders/adminRouteBuilder";

const OrganizationPage = adminRouteBuilder.route(
  async function OrganizationPage() {
    const organizationController = serverContainer.get(OrganizationController);
    const organizations = await organizationController.getOrganizations();
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
  },
);
export default OrganizationPage;
