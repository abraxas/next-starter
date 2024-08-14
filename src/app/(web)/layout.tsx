import React from "react";
import Providers from "@/app/providers/providers";
import ChakraAppShell from "@/app/(web)/components/ChakraAppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ChakraAppShell>{children}</ChakraAppShell>
    </Providers>
  );
}
