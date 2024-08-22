"use client";

import { User } from "@prisma/client";
import ProfileForm from "@/app/(web)/profile/components/ProfileForm";
import { Box, Flex, useColorModeValue, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { onSubmitAction } from "@/app/(web)/profile/components/actions";

export default function ProfileComponent({ user }: { user: User }) {
  const router = useRouter();
  const toast = useToast();

  function onClose() {
    router.push("/");
  }

  async function onSubmit(state: {}, formData: FormData) {
    const result = await onSubmitAction(state, formData);
    console.log(result);
    if (result.success) {
      toast({
        title: "Profile updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    return result;
  }

  console.log({ user });

  return <ProfileForm user={user} onClose={onClose} onSubmit={onSubmit} />;
}
