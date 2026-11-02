"use client";

import { useSearchParams } from "next/navigation";
import { IntroductionFormCore } from "./IntroductionForm";
import { findAnExpertService, getHelpPrefill } from "@/lib/introductions/url-prefill";

// The forms on /get-help and /find-an-expert, pre-filled from the query string.
// Both pages are static: useSearchParams suspends while they prerender, so each
// page gives its Suspense boundary a fallback of the form with no pre-fill. That
// fallback is the HTML crawlers get; these take over once the page hydrates.
// Keyed on the query string because the form reads its defaults once on mount.

export function GetHelpForm() {
  const params = useSearchParams();
  return <IntroductionFormCore key={params.toString()} {...getHelpPrefill(params)} urlSuburb={params.get("suburb")} urlType={params.get("type")} />;
}

export function FindAnExpertForm() {
  const params = useSearchParams();
  return <IntroductionFormCore key={params.toString()} defaultService={findAnExpertService(params)} urlSuburb={params.get("suburb")} urlType={params.get("type")} source="find-an-expert" compact />;
}
