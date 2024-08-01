"use client";

import { Box, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function NavLink(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
}
