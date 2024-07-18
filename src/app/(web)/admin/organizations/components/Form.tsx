"use client";

import { useFormState } from "react-dom";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Organization } from "@prisma/client";
import Link from "next/link";
import { updateOrganization, createOrganization } from "../actions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type InitialData = {
  slug: string;
  name: string;
};

type FormProps = {
  initialData: InitialData;
  id?: string;
};

const initialState = {
  errors: {},
  errorMsg: "",
  redirect: false,
};

export default function Form({ initialData, id }: FormProps) {
  const handleSubmit = id
    ? updateOrganization.bind(null, id)
    : createOrganization;
  const [state, formAction] = useFormState(
    handleSubmit as any,
    initialState as any,
  );

  useEffect(() => {
    if (state?.redirect) {
      redirect("/admin/organizations");
    }
  }, [state?.redirect]);

  console.dir(state);

  return (
    <form action={formAction as any}>
      <Stack spacing={3}>
        <Card flex={1} maxW={"lg"}>
          <CardBody>
            <Stack spacing={3}>
              {!!state?.errorMsg && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{state?.errorMsg}</AlertDescription>
                </Alert>
              )}
              <FormControl isInvalid={!!state?.errors?.slug}>
                <FormLabel>Slug</FormLabel>
                <Input name="slug" defaultValue={initialData?.slug} />
                {state?.errors?.slug && (
                  <FormErrorMessage>{state?.errors?.slug}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!state?.errors?.name}>
                <FormLabel>Name</FormLabel>
                <Input name="name" defaultValue={initialData?.name} />
                {state?.errors?.name && (
                  <FormErrorMessage>{state?.errors?.name}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </CardBody>
        </Card>

        <Stack spacing={3} direction="row">
          <Button type="submit">Save</Button>
          <Link href="/admin/organizations">
            <Button>Cancel</Button>
          </Link>
        </Stack>
      </Stack>
    </form>
  );
}
