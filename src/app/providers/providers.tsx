import { ClientProviders } from "@/app/providers/client-providers";
import ServerProviders from "@/app/providers/server-providers";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <ServerProviders>{children}</ServerProviders>
    </ClientProviders>
  );
}
