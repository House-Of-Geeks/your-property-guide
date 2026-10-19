"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteFlags } from "@/lib/flags";

// The server's switches (src/lib/flags.ts), handed down from the marketing
// layout so client forms can match their promises to them. Off by default:
// a form outside the provider never offers something that might not happen.

const FlagsContext = createContext<SiteFlags>({ series: false, checkIns: false });

export function FlagsProvider({ flags, children }: { flags: SiteFlags; children: ReactNode }) {
  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}

export function useSiteFlags(): SiteFlags {
  return useContext(FlagsContext);
}
