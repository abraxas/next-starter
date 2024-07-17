"use client";
import { createContext, useContext } from "react";
import { validateRequest } from "@/lib/auth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type ContextType = Awaited<ReturnType<typeof validateRequest>> & {
  sessionCookieName: string | undefined;
};

const SessionContext = createContext<ContextType>({
  session: null,
  user: null,
  sessionCookieName: undefined,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: ContextType }>) => {
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await axios.get("/auth/session");
      return data;
    },
  });

  const providedData = isLoading ? value : sessionData;

  return (
    <SessionContext.Provider value={providedData}>
      {children}
    </SessionContext.Provider>
  );
};
