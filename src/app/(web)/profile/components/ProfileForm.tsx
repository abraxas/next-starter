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
} from "@chakra-ui/react";
import { useState } from "react";
import { User } from "@prisma/client";
import { useFormState } from "react-dom";

interface ProfileFormProps {
  user: User;
  onClose: () => void;
  onSubmit: any; //(state: {}, formData: FormData) => {} | Promise<{}>;
}

export default function ProfileForm({
  user,
  onClose,
  onSubmit,
}: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [state, formAction] = useFormState<Partial<User>>(onSubmit, {});
  console.log({ formState: state });

  return (
    <Stack spacing={4}>
      <form action={formAction}>
        <FormControl id="image" textAlign="center">
          {" "}
          {/* Center the profile image */}
          {user.image ? (
            <Avatar size="2xl" src={user.image} />
          ) : (
            <Avatar size="2xl" />
          )}
        </FormControl>
        <FormControl id="name" mt={4}>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" defaultValue={name ?? ""} />
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
            Close
          </Button>
        </Flex>
      </form>
    </Stack>
  );
}