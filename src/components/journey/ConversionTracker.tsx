"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface ConversionTrackerProps {
  /** Identifies the funnel — appraisal form vs match-an-expert flow. */
  flow: "appraisal" | "get-connected";
}

// Fires once on mount when a thank-you page renders. Single source of
// truth for "a lead converted" — anchor-scroll CTAs can't measure this,
// which is why we route through a dedicated thank-you URL.
export function ConversionTracker({ flow }: ConversionTrackerProps) {
  const params = useSearchParams();

  useEffect(() => {
    clarityEvent("lead_conversion");
    clarityTag("conversion_flow", flow);
    const intent = params.get("intent");
    const suburb = params.get("suburb");
    if (intent) clarityTag("conversion_intent", intent);
    if (suburb) clarityTag("conversion_suburb", suburb);
  }, [flow, params]);

  return null;
}
