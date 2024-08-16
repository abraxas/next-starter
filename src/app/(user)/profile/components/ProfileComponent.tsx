"use client";

import { User } from "@prisma/client";
import ProfileForm from "@/app/(user)/profile/components/ProfileForm";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { onSubmitAction } from "@/app/(user)/profile/components/actions";

export default function ProfileComponent({ user }: { user: User }) {
  const router = useRouter();

  function onClose() {
    router.push("/");
  }

  async function onSubmit(state: Partial<User>) {
    const result = await onSubmitAction(state);
    console.log(result);
    return result;
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
        width={"400px"} // Increase the width of the form
      >
        <ProfileForm user={user} onClose={onClose} onSubmit={onSubmit} />
      </Box>
    </Flex>
  );
}
