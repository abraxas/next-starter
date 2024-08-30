"use client";

import { JwtClaim } from "@services/server/JwtClaims/JwtClaims.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRetoast from "@/lib/util/useRetoast";

type NewUserRedirectorProps = {
  claim?: JwtClaim | undefined;
};

export default function NewUserRedirector({ claim }: NewUserRedirectorProps) {
  const retoast = useRetoast();
  const router = useRouter();

  useEffect(() => {
    if (!claim || claim.type !== "new_user") {
      retoast({
        title: "Error",
        description: "An error occurred.  Please try again later.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      router.push("/");
    }
  }, [claim?.type]);

  return null;
}
