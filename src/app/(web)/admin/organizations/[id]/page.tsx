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
import OrganizationForm from "@/app/(web)/admin/organizations/components/OrganizationForm";
import OrganizationView from "@/app/(web)/admin/organizations/components/OrganizationView";
import { notFound } from "next/navigation";
import { Organization } from "@prisma/client";

export default async function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const organizationController = serverContainer.get(OrganizationController);
  const organization: Organization | undefined =
    await organizationController.getOrganizationById(params.id);

  if (!organization || !params.id) {
    return notFound();
  }
  return (
    <Box>
      <OrganizationView organization={organization} id={params.id} />
    </Box>
  );
}
