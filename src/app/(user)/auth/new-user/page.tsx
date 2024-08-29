"use server";

import { inversifyServerContainer } from "@services/inversifyServerContainer";
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
  const jwtClaims = inversifyServerContainer.get(JwtClaimsService);
  const rawClaim = await jwtClaims.getRawClaimFromCookie();
  const validatedClaim = await jwtClaims.getClaimFromCookie();
  const claimdata = NewUserClaimSchema.safeParse(validatedClaim);

  if (!rawClaim || !claimdata.success) {
    redirect("/");
  }

  const claim = claimdata.data;

  return (
    <div>
      <NewUserRedirector claim={claim} />
      New User
      {JSON.stringify(claim)}
      <NewUserFormComponent rawClaim={rawClaim} claim={claim} />
    </div>
  );
}
