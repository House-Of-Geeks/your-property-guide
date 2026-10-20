// The one address every "start my plan" button uses (20 Oct 2026). The
// homepage hero, the closing band, the header, the phone menu and the phone
// bar all build their link here, from the same move and the same place, so
// one entry point can't drop the suburb another one keeps.

import type { Journey } from "@/lib/lead-kinds";

/** A place picked on the page: a suburb slug ("hamilton-qld-4007") and its state ("QLD"). Never a street address. */
export interface PlanPlace {
  slug: string;
  state: string;
}

/**
 * Answers already given on the page (20 Oct 2026: the homepage's "Where are
 * you up to?"), so the planner skips those questions: ss (selling stage),
 * bs (buying stage) and o (the order, for both).
 */
export interface PlanStartAnswers {
  ss?: string;
  bs?: string;
  o?: string;
}

export function planStartHref({ journey, place, from, answers }: { journey: Journey | null; place?: PlanPlace | null; from?: string; answers?: PlanStartAnswers }): string {
  const qs = new URLSearchParams();
  if (journey) qs.set("j", journey);
  if (place) {
    qs.set("s", place.state.toLowerCase());
    qs.set("sub", place.slug);
  }
  if (answers?.ss) qs.set("ss", answers.ss);
  if (answers?.bs) qs.set("bs", answers.bs);
  if (answers?.o) qs.set("o", answers.o);
  if (from) qs.set("from", from);
  const q = qs.toString();
  return q ? `/plan?${q}` : "/plan";
}
