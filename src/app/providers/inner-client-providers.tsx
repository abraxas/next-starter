// app/providers.tsx
"use client";

import React from "react";
import RetoastProvider from "@/app/providers/client/RetoastProvider";

export function InnerClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <RetoastProvider />
      {children}
    </React.Fragment>
  );
}
