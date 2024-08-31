import { Heading } from "@chakra-ui/react";
import CreateOrganizationForm from "@/app/(web)/organizations/create/components/CreateOrganizationForm";

export default function CreateOrganization() {
  return (
    <div>
      <Heading>Create Your New Organization</Heading>
      <CreateOrganizationForm />
    </div>
  );
}
