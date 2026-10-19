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

export function planStartHref({ journey, place, from }: { journey: Journey | null; place?: PlanPlace | null; from?: string }): string {
  const qs = new URLSearchParams();
  if (journey) qs.set("j", journey);
  if (place) {
    qs.set("s", place.state.toLowerCase());
    qs.set("sub", place.slug);
  }
  if (from) qs.set("from", from);
  const q = qs.toString();
  return q ? `/plan?${q}` : "/plan";
}
