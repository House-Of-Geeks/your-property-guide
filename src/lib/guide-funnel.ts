import { ENTRY_PARAM } from "@/lib/attribution";
import type { PersonaId } from "@/lib/constants/journey";

// Which of the two free guides a page's CTAs push, and the link into it.
//
// The selling guide is where the money is (the agent pays for the
// introduction), but pitching it to a first-home buyer reading about LMI is
// an intent mismatch that wastes the click. Pages route by their persona,
// the same field that drives the hub link and the sticky CTA, so a new guide
// is routed by declaring who it is for rather than by a slug list.

export type GuideAudience = "buying" | "selling";

/**
 * The buyer personas (first home, upgrading) get the buying guide and the
 * selling persona the selling guide. Investing and renovating pages have no
 * single side, so they return undefined and callers keep the selling default
 * (their CTA copy is written for the investor or renovator who sells).
 */
export function guideAudienceForPersona(persona: PersonaId | null | undefined): GuideAudience | undefined {
  switch (persona) {
    case "first-home":
    case "upgrading":
      return "buying";
    case "selling":
      return "selling";
    default:
      return undefined;
  }
}

/** The same routing for a blog or news post, from its blog category. */
export function guideAudienceForBlogCategory(category: string | null | undefined): GuideAudience | undefined {
  if (category === "Selling") return "selling";
  if (category === "Buying Guide") return "buying";
  return undefined;
}

interface GuideFunnelLink {
  /** Suburb slug: the funnel reads ?suburb= and skips its first question. */
  suburb?: string | null;
  /** Slug of the page the CTA sits on, recorded with the lead (Lead.attribution.entry). */
  from?: string | null;
  /** Land on the form itself (#guide-funnel) rather than the top of the pitch. */
  toForm?: boolean;
}

/** /selling-guide or /buying-guide, with the suburb pre-answered and the sending page, when given. */
export function guideFunnelHref(audience: GuideAudience, { suburb, from, toForm }: GuideFunnelLink = {}): string {
  const qs = new URLSearchParams();
  if (suburb) qs.set("suburb", suburb);
  if (from) qs.set(ENTRY_PARAM, from);
  const query = qs.toString();
  return `/${audience}-guide${query ? `?${query}` : ""}${toForm ? "#guide-funnel" : ""}`;
}
