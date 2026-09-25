"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE, parseAttribution, updateAttribution } from "@/lib/attribution";

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : undefined;
}

/**
 * Records how this browser found us (first visit, latest ad click) in the
 * ypg_attr first-party cookie. Runs once per full page load, which is when
 * an ad click or campaign link lands; client-side navigations don't carry
 * new campaign params. updateAttribution() here is only the gate: when
 * something changed, /api/attr sets the cookie from its response (Safari
 * caps cookies written by script). Never write ypg_attr via document.cookie,
 * or the cap applies again. /api/leads reads the cookie server-side, so
 * lead forms need no changes. Renders nothing.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const existing = parseAttribution(readCookie(ATTRIBUTION_COOKIE));
      const next = updateAttribution(existing, window.location.href, document.referrer, new Date().toISOString());
      if (!next) return;
      fetch("/api/attr", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ href: window.location.href, referrer: document.referrer }),
      }).catch(() => {});
    } catch {
      // Cookies blocked or a malformed URL: attribution is nice-to-have.
    }
  }, []);
  return null;
}
