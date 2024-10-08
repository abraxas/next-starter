// app/providers.tsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RetoastProvider from "@/app/providers/client/RetoastProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2f9",
      100: "#c8e4f3",
      200: "#a6d4ec",
      300: "#83c3e5",
      400: "#61b3de",
      500: "#3fa3d7",
      600: "#2f82ab",
      700: "#21627f",
      800: "#123f53",
      900: "#001d27",
    },
  },
});
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript />
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.Fragment>
  );
}
