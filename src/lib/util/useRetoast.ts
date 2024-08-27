"use client";

import { useCookies } from "next-client-cookies";
import { UseToastOptions } from "@chakra-ui/react";

export default function useRetoast() {
  const cookies = useCookies();

  function retoast({
    title,
    description,
    status,
    duration,
    isClosable,
  }: UseToastOptions) {
    //create a retoast cookie
    cookies.set(
      "retoast",
      JSON.stringify({ title, description, status, duration, isClosable }),
      {
        expires: new Date(Date.now() + 1000),
      },
    );
  }
  return retoast;
}
