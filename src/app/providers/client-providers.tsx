// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript />
        <ChakraProvider>{children}</ChakraProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}
