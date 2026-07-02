"use client";

import { useSyncExternalStore } from "react";
import { PhoneFollowUp } from "./PhoneFollowUp";

// sessionStorage key the funnels write after a phone-less submit. The lead
// id is the bearer credential for /api/leads/enrich, so it must never ride
// in the URL — thanks-page URLs end up in browser history, referrers and
// Clarity session replays. Same-tab storage keeps it private to the person
// who actually submitted the form.
export const ENRICH_LEAD_STORAGE_KEY = "ypg-enrich-lead";

interface ThanksPhoneAskProps {
  /** Where this ask is rendered, for Clarity segmentation. */
  source: string;
  /** Lead-in line above the field. */
  prompt: string;
}

/**
 * Thanks-page wrapper around PhoneFollowUp. Renders only when the funnel
 * that navigated here left a lead id in sessionStorage — i.e. exactly for
 * the submitter who skipped the mobile field, and never for someone who
 * merely opens a shared/bookmarked thanks URL.
 */
export function ThanksPhoneAsk({ source, prompt }: ThanksPhoneAskProps) {
  // useSyncExternalStore instead of setState-in-effect: the server
  // snapshot (null) matches the server-rendered HTML, then the client
  // snapshot reads storage on hydration — no mismatch, no extra render.
  const leadId = useSyncExternalStore(
    () => () => {}, // storage never changes during the page's lifetime
    () => {
      try {
        return sessionStorage.getItem(ENRICH_LEAD_STORAGE_KEY);
      } catch {
        return null; // storage unavailable (private mode/blocked) — no ask
      }
    },
    () => null,
  );

  if (!leadId) return null;
  return (
    <div className="rise rise-d3 mx-auto max-w-lg mt-6 text-left">
      <PhoneFollowUp leadId={leadId} source={source} prompt={prompt} />
    </div>
  );
}
