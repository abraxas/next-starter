import React from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from "@/app/(web)/admin/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Sidebar />
      <Box ml={60} p="4">
        {children}
      </Box>
    </Box>
  );
}
