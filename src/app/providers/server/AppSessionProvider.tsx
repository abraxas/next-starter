import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export default async function AppSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
