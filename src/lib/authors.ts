// The site's named writers, as /about introduces them: the anchor of each
// person's card on /about, the job title that card shows, and a short bio
// drawn only from what that card (or the page's Person JSON-LD) says.
// AuthorBylineCard and the article template's byline read this, so each
// byline links to its own writer and carries that writer's own bio.
//
// Why (commercial intent review, 10 Oct 2026, finance-tax F12): the byline
// card hard-coded Andy McMaster's bio ("Editor of Your Property Guide...")
// for every author, and every byline linked to /about#andy-mcmaster, so
// articles by Bec Ramirez and Ellie Johnston were attributed to the editor.
//
// Add a writer here only once /about has a card for them with the same id.
// Tested in tests/lib/authors.test.ts, which checks every entry against the
// ids and text on src/app/(marketing)/about/page.tsx.

export interface AuthorProfile {
  /** The id of this person's card on /about. */
  anchor: string;
  /** Job title as /about shows it. */
  jobTitle: string;
  /** Headshot under /public. */
  image: string;
  /** Short bio taken from /about. No credential that /about does not state. */
  bio: string;
}

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  "Andy McMaster": {
    anchor: "andy-mcmaster",
    jobTitle: "Editor & co-founder",
    image: "/images/agents/andy-mcmaster.jpg",
    // Verbatim from the Person JSON-LD on /about.
    bio:
      "Editor of Your Property Guide. Writes the editorial methodology, scheme and policy commentary, and oversees the suburb data review. Based in Brisbane, Australia.",
  },
  "Bec Ramirez": {
    anchor: "bec-ramirez",
    jobTitle: "Property & finance writer",
    image: "/images/agents/bec-ramirez.jpg",
    bio:
      "Senior writer on the tax, lending and investment side of property. Came to Your Property Guide from a mortgage broking background, and covers negative gearing, capital gains tax, depreciation, SMSF property, foreign buyer rules and the federal and state policy changes that move the market.",
  },
  "Ellie Johnston": {
    anchor: "ellie-johnston",
    jobTitle: "Market & suburb research",
    image: "/images/agents/ellie-johnston.jpg",
    bio:
      "Leads market and suburb research at Your Property Guide. Her background is in property data journalism, working from Valuer-General releases, ABS data and listing-portal aggregates. Writes the capital-city market updates, state buying guides, regional research and most of the suburb profiles.",
  },
};

/**
 * Bio for an author /about does not introduce as a person (the 91 guides
 * bylined "Your Property Guide editorial"). States nothing beyond what
 * /about's methodology and corrections sections cover.
 */
export const EDITORIAL_BIO =
  "Written by the Your Property Guide editorial team. How we research, source, date and correct our guides is set out on our About page.";

/** Where an unnamed or unlisted author's byline links: how we write and check. */
export const EDITORIAL_HREF = "/about#methodology";

export function authorProfile(name: string | undefined): AuthorProfile | undefined {
  if (!name) return undefined;
  return Object.prototype.hasOwnProperty.call(AUTHOR_PROFILES, name) ? AUTHOR_PROFILES[name] : undefined;
}

/** The /about link for a byline: the writer's own card, or the methodology for anyone else. */
export function authorAboutHref(name: string | undefined): string {
  const p = authorProfile(name);
  return p ? `/about#${p.anchor}` : EDITORIAL_HREF;
}
