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
import { createOrganizationAction, updateOrganizationAction } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

type InitialData = {
  slug: string;
  name: string;
};

type FormProps = {
  initialData?: InitialData;
  id?: string;
  readonly?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

type ActionStateType = {
  errors?: Record<string, string>;
  errorMsg?: string;
  redirect?: boolean;
};

const initialState = {
  errors: {} as Record<string, string>,
  errorMsg: "",
  redirect: false,
};

export default function OrganizationForm({
  initialData,
  id,
  readonly,
  onCancel,
  onSuccess,
}: FormProps) {
  const router = useRouter();
  const isEdit = !!id;

  const [state, setState] = useState<ActionStateType | undefined>(initialState);
  async function onSubmit(formData: FormData) {
    const handler = isEdit
      ? updateOrganizationAction.bind(null, id)
      : createOrganizationAction;
    const data = {
      slug: formData.get("slug")?.toString(),
      name: formData.get("name")?.toString(),
    };

    console.dir({ data });

    const result = await handler(data);
    console.log("RES");
    console.log({ result });
    if (result?.data?.success) {
      if (onSuccess) {
        onSuccess();
        return;
      } else {
        router.push("/admin/organizations");
      }
    }
    setState(result?.data);
  }

  //const { execute, result: state } = useAction(onSubmit);

  return (
    <form action={onSubmit}>
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
                <Input
                  name="slug"
                  defaultValue={initialData?.slug}
                  readOnly={readonly || isEdit}
                  variant={readonly || isEdit ? "none" : "outline"}
                />
                {state?.errors?.slug && (
                  <FormErrorMessage>{state?.errors?.slug}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!state?.errors?.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  defaultValue={initialData?.name}
                  readOnly={readonly}
                  variant={readonly ? "none" : "outline"}
                />
                {state?.errors?.name && (
                  <FormErrorMessage>{state?.errors?.name}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </CardBody>
        </Card>

        {!readonly ? (
          <Stack spacing={3} direction="row">
            <Button type="submit">Save</Button>
            {onCancel ? (
              <Button onClick={onCancel}>Cancel</Button>
            ) : (
              <Link href="/admin/organizations">
                <Button>Cancel</Button>
              </Link>
            )}
          </Stack>
        ) : null}
      </Stack>
    </form>
  );
}
