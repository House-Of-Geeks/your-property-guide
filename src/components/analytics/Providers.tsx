"use client";

import { SessionProvider } from "next-auth/react";
import { QuantcastUser } from "./QuantcastUser";
import { AttributionCapture } from "./AttributionCapture";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <QuantcastUser />
      <AttributionCapture />
    </SessionProvider>
  );
}
