// app/layout.tsx
import { ClientProviders } from "../providers/client-providers";
import { fonts } from "@/app/fonts";
import Nav from "@/app/(web)/components/Nav";
import React from "react";
import { Box } from "@chakra-ui/react";
import ServerProviders from "@/app/providers/server-providers";
import Providers from "@/app/providers/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Nav />
      <Box p={4}>{children}</Box>
    </Providers>
  );
}
