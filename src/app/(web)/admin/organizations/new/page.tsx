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
import { notFound } from "next/navigation";
import { Organization } from "@prisma/client";

export default async function NewOrganizationPage() {
  return (
    <Box>
      <OrganizationForm />
    </Box>
  );
}
