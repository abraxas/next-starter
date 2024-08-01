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
import OrganizationForm from "@/app/(web)/sysadmin/organizations/components/OrganizationForm";
import { notFound } from "next/navigation";
import { Organization } from "@prisma/client";
import { UserService } from "@services/server/users/UserService";
import { adminRouteBuilder } from "@/lib/routeBuilders/adminRouteBuilder";

const NewOrganizationPage = adminRouteBuilder.route(async () => {
  const userService = serverContainer.get(UserService);
  await userService.redirectIfNotAdmin();
  return (
    <Box>
      <OrganizationForm />
    </Box>
  );
});
export default NewOrganizationPage;
