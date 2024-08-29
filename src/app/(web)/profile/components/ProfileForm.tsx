import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Avatar,
  useColorModeValue,
  Spacer,
  ButtonGroup,
  HStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { User } from "@prisma/client";
import { useFormState } from "react-dom";

interface ProfileFormProps<T extends Partial<User>> {
  user: T;
  onClose: () => void;
  onSubmit: any; //(state: {}, formData: FormData) => {} | Promise<{}>;

  closeLabel?: string;
  hideImage?: boolean;
}

export default function ProfileForm<T extends Partial<User>>({
  user,
  onClose,
  onSubmit,

  closeLabel = "Close",
  hideImage,
}: ProfileFormProps<T>) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [state, formAction] = useFormState<any>(onSubmit, {});
  console.log({ formState: state });

  const userImage = useMemo(() => {
    return user.image;
  }, [user?.image]);
  function getError(field: string) {
    return state?.error?.fieldErrors?.[field] ?? [];
  }
  function isError(field: string) {
    return getError(field).length > 0;
  }

  console.log({ state });

  return (
    <Stack spacing={4}>
      <form action={formAction}>
        {state?.error?.formError ? (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{state.error.formError}</AlertDescription>
          </Alert>
        ) : null}
        <FormControl id="image" textAlign="center">
          {" "}
          {/* Center the profile image */}
          {!hideImage ? (
            userImage ? (
              <Avatar size="2xl" src={userImage} />
            ) : (
              <Avatar size="2xl" />
            )
          ) : null}
        </FormControl>
        <FormControl id="name" mt={4}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            isInvalid={isError("name")}
            defaultValue={name ?? ""}
          />
          {isError("name") && (
            <Text color="red.500">{getError("name").join(", ")}</Text>
          )}
        </FormControl>
        <FormControl id="email" mt={4}>
          <FormLabel>Email</FormLabel>
          {/*<Input*/}
          {/*  type="email"*/}
          {/*  value={email}*/}
          {/*  onChange={(e) => setEmail(e.target.value)}*/}
          {/*/>*/}
          <Text p={1}>{email}</Text>
        </FormControl>
        <Flex pt={4} gap={5} align="center">
          <Button
            flex={1}
            type="submit"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Save
          </Button>
          <Button flex={1} onClick={onClose}>
            {closeLabel}
          </Button>
        </Flex>
      </form>
    </Stack>
  );
}
