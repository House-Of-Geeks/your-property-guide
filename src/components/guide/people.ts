// The named people who write and review guides, as the /about page lists
// them. Bylines and the author card read this so each person keeps their own
// photo, role, one-line bio and /about anchor (the review of 10 Oct 2026
// found three writers sharing Andy's bio and link). Roles and bios restate
// /about; add a person here only once they are on that page.

export interface Person {
  name: string;
  /** Anchor on /about (#andy-mcmaster). */
  slug: string;
  image: string;
  role: string;
  bio: string;
}

const PEOPLE: readonly Person[] = [
  {
    name: "Andy McMaster",
    slug: "andy-mcmaster",
    image: "/images/agents/andy-mcmaster.jpg",
    role: "Founder and editor",
    // The facts in src/lib/founder.ts, and his editing role. Nothing else.
    bio: "Founder of Your Property Guide. Andy started his career selling Australia’s $10 million to $20 million homes and was head-hunted after two years to advise some of the biggest companies in property; his advice has generated over $4 billion in property sales in the past five years. He edits every guide and signs it off before it publishes.",
  },
  {
    name: "Bec Ramirez",
    slug: "bec-ramirez",
    image: "/images/agents/bec-ramirez.jpg",
    role: "Property and finance writer",
    bio: "Senior writer on property tax, lending, investment and the federal and state policy changes that move the market.",
  },
  {
    name: "Ellie Johnston",
    slug: "ellie-johnston",
    image: "/images/agents/ellie-johnston.jpg",
    role: "Market and suburb research",
    bio: "Senior writer on capital-city market updates, suburb research, regional research and the state buying guides.",
  },
];

export function findPerson(name: string | undefined | null): Person | undefined {
  if (!name) return undefined;
  return PEOPLE.find((p) => p.name === name);
}

export function personHref(p: Person): string {
  return `/about#${p.slug}`;
}

/** Where the "How we keep this accurate" line points. */
export const METHODOLOGY_HREF = "/about#methodology";

/** "30 September 2026" from an ISO date, read in UTC so a date never shifts a day. */
export function formatGuideDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
