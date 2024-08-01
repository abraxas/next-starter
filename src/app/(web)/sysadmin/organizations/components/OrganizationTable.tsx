"use client";

import { Organization } from "@prisma/client";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AppTable from "@/app/(web)/components/table/Table";
import Link from "next/link";
import React from "react";
import { FaRegEdit } from "react-icons/fa";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("slug", {
    id: "slug",
    header: "Slug",
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
  columnHelper.accessor("updatedAt", {
    id: "lastUpdated",
    header: "Last Updated",
    cell: (info: any) =>
      info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <Link href={`/sysadmin/organizations/${row.original.id}`}>
          <FaRegEdit />
        </Link>
      </div>
    ),
  }),
];

export default function OrganizationTable({
  organizations,
}: {
  organizations: Organization[];
}) {
  const table = useReactTable<Organization>({
    columns,
    data: organizations ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
    // etc.
  } as any);

  return <AppTable table={table} />;
}
