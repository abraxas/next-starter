"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import AppTable from "@/app/(web)/components/table/Table";
import React from "react";
import { Prisma, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";
import { Heading } from "@chakra-ui/react";
import $OrganizationPayload = Prisma.$OrganizationPayload;
import { undefined } from "zod";

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
        <Link href={`/admin/organizations/${row.original.id}`}>
          <FaRegEdit />
        </Link>
      </div>
    ),
  }),
];

export default function OrganizationPage() {
  const { data } = useQuery({
    initialData: [],
    queryKey: "organizations",
    queryFn: async () => {
      const res = await fetch("/api/admin/organizations");
      return res.json();
    },
  } as any);

  //{ getTableProps, getTableBodyProps, headerGroups, rows, prepareRow }
  const table = useReactTable<Organization>({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
    // etc.
  } as any);

  return (
    <div>
      <Heading size="lg">Organizations</Heading>
      <AppTable table={table} />
    </div>
  );
}
