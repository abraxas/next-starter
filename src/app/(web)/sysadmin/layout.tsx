import React from "react";
import { Box } from "@chakra-ui/react";
import SysadminSidebar from "@/app/(web)/sysadmin/components/SysadminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <SysadminSidebar />
      <Box ml={60} p="4">
        {children}
      </Box>
    </Box>
  );
}
