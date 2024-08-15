"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Container,
  Divider,
  AbsoluteCenter,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { codeAction } from "@/app/(user)/login/actions";
import { loginUser, postForm } from "@/app/(user)/auth/email/code/actions";

type LoginFormProps = {
  credentialLoginAction: (foo: any) => any;
};

export default function CodeForm() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");

  const email = searchParams.get("email")!;

  const router = useRouter();
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const flexColorModeValue = useColorModeValue("gray.50", "gray.800");
  const boxColorModeValue = useColorModeValue("white", "gray.700");

  if (process.env.NEXT_PUBLIC_AUTH_AUTO_REDIRECT) {
    router.push(`/auth/${process.env.NEXT_PUBLIC_AUTH_AUTO_REDIRECT}`);
    return <div />;
  }

  console.log({ email, code });
  const codeLoginAction = async (formData: FormData) => {
    const result = await loginUser({ code, email });

    if (result?.data?.error) {
      console.log(result?.data?.error);
    }
    return router.push("/");
  };

  const onPinChange = (value: string) => {
    setCode(value);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={flexColorModeValue}
    >
      <form action={codeLoginAction}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Almost there!</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Check your email for a 6-digit code.
            </Text>
          </Stack>
          <Box rounded={"lg"} bg={boxColorModeValue} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <Text>Sign in using your email address.</Text>
              {loginError && (
                <Alert status="error">
                  <AlertIcon />
                  {loginError}
                </Alert>
              )}
              <Stack pb={5}>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="code" value={code} />

                <FormControl id="email">
                  <FormLabel>Code</FormLabel>
                  <HStack>
                    <PinInput onChange={onPinChange} otp placeholder="">
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </FormControl>
              </Stack>
              <Stack spacing={10}>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}
