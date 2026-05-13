import { SITE_URL } from "@/lib/constants";

interface GuideOgInput {
  slug: string;
  title: string;
  description: string;
  /** Persona id e.g. "first-home", capitalised on the OG card */
  persona?: string;
}

const PERSONA_LABEL: Record<string, string> = {
  "first-home": "First home buyer",
  "selling":    "Selling your home",
  "upgrading":  "Moving home",
  "investing":  "Investor",
  "renovating": "Renovating",
  "renters":    "Renters",
};

/**
 * Build the absolute OG image URL for a guide page. Title and description are
 * passed through as query params so the edge handler can render the card
 * without importing the guide's frontmatter.
 *
 * Returned as the absolute URL so OpenGraph crawlers don't have to resolve a
 * relative path.
 */
export function buildGuideOgImageUrl(input: GuideOgInput): string {
  const personaLabel = input.persona ? PERSONA_LABEL[input.persona] ?? "Guide" : "Guide";
  const params = new URLSearchParams({
    title: input.title,
    desc: input.description,
    persona: personaLabel,
  });
  return `${SITE_URL}/api/og/guide/${input.slug}?${params.toString()}`;
}

/**
 * Build the absolute OG image URL for a suburb profile page. The handler
 * pulls the suburb data itself, so we just need the slug.
 */
export function buildSuburbOgImageUrl(slug: string): string {
  return `${SITE_URL}/api/og/suburb/${slug}`;
}

/**
 * Convenience: returns the openGraph.images shape Next 16 expects, given a
 * guide frontmatter input. Drop into metadata.openGraph.images.
 */
export function guideOgImages(input: GuideOgInput) {
  return [
    {
      url: buildGuideOgImageUrl(input),
      width: 1200,
      height: 630,
      alt: input.title,
    },
  ];
}
