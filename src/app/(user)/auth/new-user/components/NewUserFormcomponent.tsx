"use client";

import { NewUserClaim } from "@services/server/JwtClaims/JwtClaims.service";
import ProfileForm from "@/app/(web)/profile/components/ProfileForm";
import { Box, Flex, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { onSubmitAction } from "@/app/(web)/profile/components/actions";
import { newUserAction } from "@/app/(user)/auth/new-user/components/actions";
import useRetoast from "@/lib/util/useRetoast";

export default function NewUserFormComponent({
  rawClaim,
  claim,
}: {
  rawClaim: string;
  claim: NewUserClaim;
}) {
  const router = useRouter();
  const toast = useToast();
  const retoast = useRetoast();
  console.log({ claim });
  const [user, setUser] = useState({
    email: claim.email,
    name: "",
  });
  const flexColorModeValue = useColorModeValue("gray.50", "gray.800");

  function handleClose() {
    router.push("/");
  }

  // async function onSubmit(state: {}, formData: FormData) {
  //   const result = await onSubmitAction(state, formData);
  //   console.log(result);
  //   if (result.success) {
  //     toast({
  //       title: "Profile updated.",
  //       status: "success",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //     router.push("/");
  //   }
  //   return result;
  // }

  async function handleSubmit(state: {}, formData: FormData) {
    console.log("LETS DO THIS");
    const user = {
      name: formData.get("name") as string,
      email: claim.email,
    };
    console.log({ user });
    const result = await newUserAction({ claim: rawClaim, user });
    console.log({ result });

    if (result?.data?.success) {
      retoast({
        title: "Your account has been created!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/");
      return;
    }
    if (result?.data?.error) {
      toast({
        title: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      //return { error: result?.data?.error };
      return {
        error: {
          formError: result?.data?.error,
        },
      };
    }
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
        <Text>Create a new user account with the following information:</Text>
        <ProfileForm
          user={user}
          onSubmit={handleSubmit}
          onClose={handleClose}
          closeLabel="Cancel"
          hideImage={true}
        />
      </Box>
    </Flex>
  );
}
