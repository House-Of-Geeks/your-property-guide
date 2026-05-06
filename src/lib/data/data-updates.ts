// Hand-curated changelog of significant data refreshes and editorial events.
// Add a new entry at the top of the array when a refresh ships.
//
// Categories:
//   data        — a measurable refresh (price data, schools, hazard, climate)
//   guide       — a new or major-update guide
//   tool        — a new or major-update tool / calculator
//   correction  — a correction logged after a reader flagged an issue

export type UpdateKind = "data" | "guide" | "tool" | "correction";

export interface DataUpdate {
  date: string;            // ISO YYYY-MM-DD
  kind: UpdateKind;
  title: string;
  /** Plain-English description of what changed */
  description: string;
  /** Optional link to the affected page or methodology section */
  href?: string;
}

export const DATA_UPDATES: DataUpdate[] = [
  {
    date: "2026-05-06",
    kind: "data",
    title: "Live counts dashboard launched",
    description:
      "Live counts of every dataset (suburbs, schools, sales, hazard, climate, agents) now refreshed hourly on /data.",
    href: "/data",
  },
  {
    date: "2026-05-06",
    kind: "guide",
    title: "Glossary expanded to 99 individually-indexed terms",
    description:
      "Each term now has its own page with DefinedTerm schema, a related-guide cross-link, and prev/next navigation.",
    href: "/glossary",
  },
  {
    date: "2026-05-06",
    kind: "tool",
    title: "Find Your Suburb quiz launched",
    description:
      "A 4-question scoring engine that surfaces six suburbs scored against your priorities, budget, and lifestyle stage.",
    href: "/find-your-suburb",
  },
  {
    date: "2026-05-06",
    kind: "tool",
    title: "Compare Suburbs tool launched",
    description:
      "Pick any two Australian suburbs and line them up side by side across price, growth, schools, walkability and risk.",
    href: "/compare",
  },
  {
    date: "2026-04-15",
    kind: "data",
    title: "Q1 2026 median price refresh — 9,400+ suburbs",
    description:
      "Quarterly refresh of state Valuer-General medians and growth across every Australian suburb.",
    href: "/methodology#median-prices",
  },
  {
    date: "2026-04-02",
    kind: "data",
    title: "ACARA 2025 school data import — 9,612 schools",
    description:
      "Annual ACARA school release imported with year ranges, sector, ICSEA, and enrolment figures.",
    href: "/methodology#schools",
  },
  {
    date: "2026-03-25",
    kind: "data",
    title: "March 2026 RBA cash rate decision logged",
    description:
      "Latest cash rate move added to the rate history with commentary on property impact.",
    href: "/rba-cash-rate",
  },
  {
    date: "2026-03-12",
    kind: "data",
    title: "Geoscience Australia flood map refresh — SEQ + Northern Rivers",
    description:
      "Updated flood class data for South-East Queensland and the Northern Rivers region following 2025 events.",
    href: "/methodology#hazard",
  },
  {
    date: "2026-02-20",
    kind: "data",
    title: "ABS demographic refresh on 47 inner-Sydney suburbs",
    description:
      "Refreshed family composition and median age data using the latest ABS Census release.",
    href: "/methodology#demographics",
  },
  {
    date: "2026-02-01",
    kind: "guide",
    title: "Six high-value SEO guides shipped",
    description:
      "How much deposit do you need, cooling-off by state, best Brisbane suburbs for families, house vs apartment, Sydney vs Melbourne, buyer's agent cost.",
    href: "/guides",
  },
  {
    date: "2026-01-15",
    kind: "data",
    title: "Walkability scores re-computed for capital city inner-rings",
    description:
      "OpenStreetMap-derived walk, transit, and bike scores recalculated on inner-ring suburbs after major OSM updates.",
    href: "/methodology#walkability",
  },
];

export function getUpdatesByKind(kind: UpdateKind): DataUpdate[] {
  return DATA_UPDATES.filter((u) => u.kind === kind);
}

export function getRecentUpdates(limit = 5): DataUpdate[] {
  return [...DATA_UPDATES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
