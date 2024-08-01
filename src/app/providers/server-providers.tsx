import "reflect-metadata";

import { revalidateTag, unstable_cache } from "next/cache";
import React from "react";
import AppSessionProvider from "@/app/providers/server/AppSessionProvider";

const forceCache = unstable_cache(async (session) => session, ["session"]);

export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSessionProvider>{children}</AppSessionProvider>;
}
