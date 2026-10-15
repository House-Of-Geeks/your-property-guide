"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface ConversionTrackerProps {
  /** Which thanks page this is. */
  flow: "appraisal" | "get-connected" | "selling-guide" | "buying-guide" | "agreement-check";
}

// Fires once when a thanks page renders. Since 14 Oct 2026 the two paths are
// counted apart: the guide thanks pages are a learning view
// ("guide_thanks_view"); only an introduction thanks page is a
// "lead_conversion". The submissions themselves are counted from the API's
// answer (src/lib/analytics.ts), so a reload here never adds a lead.
export function ConversionTracker({ flow }: ConversionTrackerProps) {
  const params = useSearchParams();

  useEffect(() => {
    const learning = flow === "selling-guide" || flow === "buying-guide";
    clarityEvent(learning ? "guide_thanks_view" : "lead_conversion");
    clarityTag("conversion_flow", flow);
    // The agreement check (15 Oct 2026) is a call from our team, not an introduction.
    clarityTag("lead_type", learning ? "learning" : flow === "agreement-check" ? "agreement-check" : "introduction");
    const intent = params.get("intent");
    const score = params.get("score");
    if (intent) clarityTag("conversion_intent", intent);
    if (score) clarityTag("conversion_score", score);
  }, [flow, params]);

  return null;
}
