"use client";

import { User } from "@prisma/client";
import ProfileForm from "@/app/(web)/profile/components/ProfileForm";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { onSubmitAction } from "@/app/(web)/profile/components/actions";
import ProfileComponent from "@/app/(web)/profile/components/ProfileComponent";

export default function ProfileModal({ user }: { user: User }) {
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
        minWidth={"400px"} // Increase the width of the form
      >
        <ProfileComponent user={user} />
      </Box>
    </Flex>
  );
}
