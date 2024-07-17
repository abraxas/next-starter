import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Organization } from "@prisma/client";
import Link from "next/link";
import { updateOrganization, createOrganization } from "../actions";

type InitialData = {
  slug: string;
  name: string;
};

type FormProps = {
  initialData: InitialData;
  action: (data: FormData) => Promise<void>;
  id?: string;
};

export default function Form({ initialData, action, id }: FormProps) {
  async function zzzhandleSubmit(formData: FormData) {
    "use server";

    console.log("GOGOGO");
    console.log(id);
    if (id) {
      console.log("GOTID");
      formData.set("id", id);
      const updateResult = await updateOrganization(formData).catch((e) => {
        console.log("EEE");
        console.dir(e);
      });
      console.dir(updateResult);
      //redirect to organizations page
    }
  }

  const handleSubmit = id
    ? updateOrganization.bind(null, id)
    : createOrganization;

  return (
    <form action={handleSubmit}>
      <Stack spacing={3}>
        <Card flex={1} maxW={"lg"}>
          <CardBody>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Slug</FormLabel>
                <Input name="slug" defaultValue={initialData?.slug} />
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" defaultValue={initialData?.name} />
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
