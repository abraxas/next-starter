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

const columnHelper = createColumnHelper<Prisma.$OrganizationPayload>();

const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
  columnHelper.accessor("updatedAt", {
    id: "lastUpdated",
    header: "Last Updated",
    cell: (info) =>
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
  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: "Name",
  //       columns: [
  //         {
  //           Header: "First Name",
  //           accessor: "firstName",
  //         },
  //         {
  //           Header: "Last Name",
  //           accessor: "lastName",
  //         },
  //       ],
  //     },
  //     {
  //       Header: "Info",
  //       columns: [
  //         {
  //           Header: "Age",
  //           accessor: "age",
  //         },
  //         {
  //           Header: "Visits",
  //           accessor: "visits",
  //         },
  //         {
  //           Header: "Status",
  //           accessor: "status",
  //         },
  //         {
  //           Header: "Profile Progress",
  //           accessor: "progress",
  //         },
  //       ],
  //     },
  //   ],
  //   [],
  // );

  const { data } = useQuery<Organization[]>({
    queryKey: "organizations",
    queryFn: async () => {
      const res = await fetch("/api/admin/organizations");
      return res.json();
    },
  });

  //{ getTableProps, getTableBodyProps, headerGroups, rows, prepareRow }
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
    // etc.
  });

  return (
    <div>
      <h1>Test</h1>
      <AppTable table={table} />
    </div>
  );
}
