"use server";

import { serverContainer } from "@services/serverContainer";
import {
  JwtClaimsService,
  NewUserClaimSchema,
} from "@services/server/JwtClaims/JwtClaims.service";
import { redirect } from "next/navigation";
import NewUserRedirector from "@/app/(user)/auth/new-user/components/NewUserRedirector";
import { Box } from "@chakra-ui/react";
import NewUserFormComponent from "@/app/(user)/auth/new-user/components/NewUserFormcomponent";

export default async function NewUserPage() {
  //toast an error and return to home IFF there is no active NewUserclaim
  const jwtClaims = serverContainer.get(JwtClaimsService);
  const rawclaim = await jwtClaims.getClaimFromCookie();
  const claimdata = NewUserClaimSchema.safeParse(rawclaim);

  if (!claimdata.success) {
    redirect("/");
  }

  const claim = claimdata.data;

  return (
    <div>
      <NewUserRedirector claim={claim} />
      New User
      {JSON.stringify(claim)}
      <NewUserFormComponent claim={claim} />
    </div>
  );
}
