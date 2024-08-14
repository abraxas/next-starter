import "reflect-metadata";

import { revalidateTag, unstable_cache } from "next/cache";
import React from "react";
import { SessionProvider } from "@/app/providers/server/SessionProvider";
import { validateRequest } from "@/lib/auth";

const forceCache = unstable_cache(async (session) => session, ["session"]);

export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  const cachedSession = await forceCache(session);

  return <SessionProvider value={cachedSession}>{children}</SessionProvider>;
}
