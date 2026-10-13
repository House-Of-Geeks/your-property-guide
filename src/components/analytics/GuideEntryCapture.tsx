"use client";

import { useEffect } from "react";
import { ENTRY_PARAM } from "@/lib/attribution";
import { captureAttribution } from "./AttributionCapture";

/**
 * Rendered on the guide funnel pages (/selling-guide, /buying-guide). A guide
 * CTA links there with ?from=<page slug>, usually as a client-side
 * navigation, which the root AttributionCapture (full loads only) never
 * sees. Recording the URL on mount puts the entry in the ypg_attr cookie, so
 * Lead.attribution.entry says which page sent the lead, on the download and
 * on any call request after it, without touching the funnel components.
 * Renders nothing.
 */
export function GuideEntryCapture() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has(ENTRY_PARAM)) captureAttribution();
  }, []);
  return null;
}
