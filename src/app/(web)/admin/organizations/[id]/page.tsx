"use client";
import { Box } from "@chakra-ui/react";
import OrganizationView from "@/app/(web)/admin/organizations/components/OrganizationView";
import { useAction } from "next-safe-action/hooks";
import { getOrganizationAction } from "@/app/(web)/admin/organizations/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { execute: getOrganization, result } = useAction(getOrganizationAction);
  useEffect(() => getOrganization({ id: params.id }), []);
  const organization = result?.data?.organization;
  console.log({ organization, params, result });

  //if notfound, give us a 404
  if (result?.data?.notFound) return <div>Not Found</div>;
  if (!organization) return <div />;

  return (
    <Box>
      <OrganizationView organization={organization} id={params.id} />
    </Box>
  );
}
