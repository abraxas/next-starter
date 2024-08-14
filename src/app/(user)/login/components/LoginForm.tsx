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
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

type LoginFormProps = {
  credentialLoginAction: (foo: any) => any;
};

export default function LoginForm({ credentialLoginAction }: LoginFormProps) {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const flexColorModeValue = useColorModeValue("gray.50", "gray.800");
  const boxColorModeValue = useColorModeValue("white", "gray.700");

  const loginAction = async (formData: FormData) => {
    const result = await credentialLoginAction(formData);
    if (result?.error) {
      setLoginError(result?.error);
    }
  };

  if (process.env.NEXT_PUBLIC_AUTH_AUTO_REDIRECT) {
    router.push(`/auth/${process.env.NEXT_PUBLIC_AUTH_AUTO_REDIRECT}`);
    return <div />;
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={flexColorModeValue}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={boxColorModeValue} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <Button
              onClick={() => router.push("/auth/google")}
              leftIcon={
                <Box
                  as={"img"}
                  src={"https://authjs.dev/img/providers/google.svg"}
                  w={6}
                  h={6}
                  alt={"Google Logo"}
                />
              }
            >
              <Container>Sign in with Google</Container>
            </Button>
          </Stack>
          {process.env.AUTH_CREDENTIALS && (
            <React.Fragment>
              <Box position="relative" py={10}>
                <Divider />
                <AbsoluteCenter bg="white" px="4">
                  OR
                </AbsoluteCenter>
              </Box>

              <Stack spacing={4}>
                <form action={loginAction}>
                  {loginError && (
                    <Alert status="error">
                      <AlertIcon />
                      {loginError}
                    </Alert>
                  )}
                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" name="email" />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Text color={"blue.400"}>Forgot password?</Text>
                    </Stack>
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
                </form>
              </Stack>
            </React.Fragment>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}