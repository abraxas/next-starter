import { ClientProviders } from "@/app/providers/client-providers";
import ServerProviders from "@/app/providers/server-providers";
import { InnerClientProviders } from "@/app/providers/inner-client-providers";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <ServerProviders>
        <InnerClientProviders>{children}</InnerClientProviders>
      </ServerProviders>
    </ClientProviders>
  );
}
