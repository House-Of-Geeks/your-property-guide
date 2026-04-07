"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    _qevents: Array<Record<string, string>>;
  }
}

export function QuantcastUser() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    window._qevents = window._qevents || [];
    window._qevents.push({ qacct: "p-0nXpAVdp8GeS5", uid: email });
  }, [email]);

  return null;
}
