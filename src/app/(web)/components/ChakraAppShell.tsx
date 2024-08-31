import ChakraAppShellClient from "@/app/(web)/components/ChakraAppShell/ChakraAppShell.Client";
import { userService } from "@services/server/users/User.service";
import { organizationController } from "@services/server/organizations/Organization.controller";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCurrentOrganization } from "./ChakraAppShell/actions";
import { queryClient } from "@/lib/serverQueryClient";

export default async function ChakraAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await userService.getCurrentUser();
  const status = user ? "authenticated" : "unauthenticated";

  const organizations =
    await organizationController.getAvailableOrganizations();

  console.log({ organizations });

  await queryClient.prefetchQuery({
    queryKey: ["currentOrganization"],
    queryFn: () => getCurrentOrganization(),
  });
  const data = queryClient.getQueryData(["currentOrganization"]);
  console.log("PREFETCHING! ", data?.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChakraAppShellClient user={user} organizations={organizations}>
        {children}
      </ChakraAppShellClient>
    </HydrationBoundary>
  );
}
