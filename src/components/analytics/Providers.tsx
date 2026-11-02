"use client";

import { QuantcastUser } from "./QuantcastUser";
import { AttributionCapture } from "./AttributionCapture";

// No SessionProvider here: it called /api/auth/session on every page load and
// window focus, and no client code reads the session. The dashboard uses
// auth() on the server, and signIn from next-auth/react needs no provider.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <QuantcastUser />
      <AttributionCapture />
    </>
  );
}
