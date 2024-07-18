import { serverContainer } from "@services/serverContainer";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex,
  Center,
} from "@chakra-ui/react";
import Form from "@/app/(web)/admin/organizations/components/Form";

export default async function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const organizationController = serverContainer.get(OrganizationController);
  const organization = await organizationController.getOrganizationById(
    params.id,
  );

  console.dir({ organizationController, organization });

  return (
    <Box>
      <Form initialData={organization as any} id={params?.id} />
    </Box>
  );
}
