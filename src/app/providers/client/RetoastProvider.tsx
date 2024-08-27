import { useCookies } from "next-client-cookies";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export default function RetoastProvider() {
  const cookies = useCookies();
  const toast = useToast();
  const retoast = cookies.get("retoast");

  useEffect(() => {
    if (retoast) {
      const id = "retoast";
      const { title, description, status, duration, isClosable } =
        JSON.parse(retoast);
      toast({ id, title, description, status, duration, isClosable });
    }
  }, [retoast]);

  return null;
}
