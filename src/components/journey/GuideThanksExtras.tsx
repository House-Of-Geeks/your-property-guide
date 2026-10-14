"use client";

import { useMemo, useSyncExternalStore } from "react";
import { GUIDE_THANKS_KEY, type GuideThanksContext } from "@/lib/guide-consent";

// The guide thanks pages' client side. Reads what the funnel left in
// sessionStorage (nothing personal since 14 Oct 2026): whether the guide
// email is on its way and whether they asked for the tips series. The old
// call card, which re-sent the download's details as an agent call, is gone:
// personal help is the /get-help form, with its own permission box.

function useGuideThanks(guide: "selling" | "buying"): GuideThanksContext | null {
  // useSyncExternalStore, not setState in an effect: the server snapshot
  // (null) matches the server HTML, the client reads storage on hydration.
  const raw = useSyncExternalStore(
    () => () => {}, // storage doesn't change during the page's life
    () => {
      try {
        return sessionStorage.getItem(GUIDE_THANKS_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const ctx = JSON.parse(raw) as GuideThanksContext;
      return ctx.guide === guide ? ctx : null;
    } catch {
      return null;
    }
  }, [raw, guide]);
}

/** What we've emailed, and what we'll send next, only when it's true. */
export function GuideEmailNote({ guide }: { guide: "selling" | "buying" }) {
  const ctx = useGuideThanks(guide);
  if (!ctx) return null;
  return (
    <p className="mt-2 text-sm text-ink-muted" role="status">
      {ctx.emailOnItsWay ? "We’ve also emailed you the link. " : "Our email didn’t go, so download it here. "}
      {ctx.sequence ? "Your short series of tips starts in a few days; every email has an unsubscribe link." : "We won’t email you anything else."}
    </p>
  );
}
