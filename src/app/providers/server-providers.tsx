import { validateRequest } from "@/lib/auth";
import { SessionProvider } from "@/app/providers/server/sessionProvider";
import { revalidateTag, unstable_cache } from "next/cache";

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
