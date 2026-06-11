"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface ConversionTrackerProps {
  /** Identifies the funnel — appraisal form, match-an-expert, or a guide download. */
  flow: "appraisal" | "get-connected" | "selling-guide" | "buying-guide";
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
    const score = params.get("score");
    if (intent) clarityTag("conversion_intent", intent);
    if (suburb) clarityTag("conversion_suburb", suburb);
    if (score) clarityTag("conversion_score", score);
  }, [flow, params]);

  return null;
}
