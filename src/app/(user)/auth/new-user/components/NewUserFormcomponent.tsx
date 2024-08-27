"use client";

import { NewUserClaim } from "@services/server/JwtClaims/JwtClaims.service";
import ProfileForm from "@/app/(web)/profile/components/ProfileForm";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";

export default function NewUserFormComponent({
  claim,
}: {
  claim: NewUserClaim;
}) {
  console.log({ claim });
  const [user, setUser] = useState({
    email: claim.email,
    name: "",
  });
  const flexColorModeValue = useColorModeValue("gray.50", "gray.800");

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
          onSubmit={() => {}}
          onClose={() => {}}
          hideImage={true}
        />
      </Box>
    </Flex>
  );
}
