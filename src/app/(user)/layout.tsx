import React from "react";
import { Box } from "@chakra-ui/react";
import Providers from "@/app/providers/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Box p={4}>{children}</Box>
    </Providers>
  );
}
