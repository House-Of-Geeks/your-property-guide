"use client";

import { IntroductionForm, type ServiceChoice } from "@/components/journeys/IntroductionForm";

// Since 14 Oct 2026 the old match form is the introduction form (one path for
// every introduction, with its own permission box, coverage shown before
// sending, and the outcome from the server). This wrapper keeps the props the
// region, suburb-agents and drawer call sites pass.

type Intent = "buying" | "selling" | "investing" | "refinancing" | "something-else" | "researching";

interface MatchAgentProps {
  initialSuburbSlug?: string | null;
  initialIntent?: Intent | null;
  compact?: boolean;
  source?: string;
}

const SERVICE_FOR_INTENT: Partial<Record<Intent, ServiceChoice>> = {
  selling: "selling-agent",
  buying: "buyers-agent",
  investing: "buyers-agent",
};

export function MatchAgent({ initialSuburbSlug, initialIntent, compact = false, source = "match" }: MatchAgentProps = {}) {
  return (
    <IntroductionForm
      defaultService={initialIntent ? SERVICE_FOR_INTENT[initialIntent] ?? null : null}
      defaultSuburb={initialSuburbSlug ?? null}
      source={source}
      compact={compact}
    />
  );
}
