"use client";

import { SessionProvider } from "next-auth/react";
import { QuantcastUser } from "./QuantcastUser";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <QuantcastUser />
    </SessionProvider>
  );
}
