// The Australian Government 5% Deposit Scheme's rules, for
// /guides/first-home-guarantee, the first home buyer guides by state, the
// deposit and LMI guides and the blog posts that quote them. The scheme is the
// Home Guarantee Scheme under another name: the First Home Guarantee for first
// home buyers (5% deposit) and the Family Home Guarantee for single parents and
// legal guardians (2% deposit). Every figure is from Housing Australia
// (firsthomebuyers.gov.au) or Part 5A of the Housing Australia Investment
// Mandate Direction 2018 (compilation 22, 18 July 2026), read on
// HG_CHECKED_ON. Nothing here is indexed: the caps and rules change only when
// Treasury amends the Direction (the last two amendments commenced on
// 1 October 2025 and 1 July 2026), so recheck when one is registered.
import type { AustralianState } from "@/lib/utils/stamp-duty";

export const HG_CHECKED_ON = "2026-10-07";

export interface Source {
  label: string;
  href: string;
}

export const HG_SOURCES = {
  scheme: { label: "Housing Australia: Australian Government 5% Deposit Scheme", href: "https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme" },
  priceCaps: { label: "Housing Australia: 5% Deposit Scheme property price caps", href: "https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme/property-price-caps" },
  firstHomeBuyers: { label: "Housing Australia: 5% Deposit Scheme for first home buyers", href: "https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme/first-home-buyers" },
  singleParents: { label: "Housing Australia: 5% Deposit Scheme for single parents and legal guardians", href: "https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme/single-parents" },
  faqs: { label: "Housing Australia: 5% Deposit Scheme FAQs", href: "https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme/5-percent-tools-and-resources/faqs" },
  factSheet: { label: "Housing Australia: 5% Deposit Scheme fact sheet (1 July 2026)", href: "https://firsthomebuyers.gov.au/sites/default/files/2025-10/Australian%20Government%205%25%20Deposit%20Scheme%20Fact%20Sheet%201%20October%202025.pdf" },
  mandate: { label: "Housing Australia Investment Mandate Direction 2018, Part 5A (compilation 22, 18 July 2026)", href: "https://www.legislation.gov.au/F2018L00994/latest/text" },
  expansion: { label: "Housing Australia Investment Mandate Amendment (Delivering on Our 2025 Election Commitment) Direction 2025", href: "https://www.legislation.gov.au/F2025L00984/asmade/text" },
  ntCaps: { label: "Housing Australia Investment Mandate Amendment (2026 Measures No. 2) Direction 2026", href: "https://www.legislation.gov.au/F2026L00542/asmade/text" },
} as const satisfies Record<string, Source>;

export const HG_DATES = {
  /** No income test, no limit on places, higher price caps, regional stream closed (F2025L00984). */
  expanded: "1 October 2025",
  /** Darwin's cap split from the rest of the Northern Territory (F2026L00542). */
  ntCapSplit: "1 July 2026",
} as const;

/** Minimum deposit, % of the value: the loan must be over 80% and no more than 95% or 98% of it (Direction s29C(2)(i), (2B)(c)). */
export const HG_MIN_DEPOSIT_PCT = { firstHome: 5, singleParent: 2 } as const;
/** The guarantee covers the loan above this % of the value, so up to 15% (first home) or 18% (single parent), and ends once the loan falls to it (s29H). */
export const HG_GUARANTEE_FROM_LVR = 80;

/** A first home buyer can't have held Australian real property, a lease or company title in this many years (s29D(1)(a), (6)). */
export const HG_NO_OWNERSHIP_YEARS = 10;
export const HG_MIN_AGE = 18;
/** First home buyers apply alone or with one other person; single parents only alone (s29C(2)(b), (2B)(a)). */
export const HG_MAX_BORROWERS = 2;
/** A single parent who owns a home must stop owning it within this many weeks of settling (s29D(3)(a)(ii)(A)). */
export const HG_SINGLE_PARENT_SELL_WEEKS = 4;
/** Months after settlement to move in (Housing Australia FAQs). */
export const HG_MOVE_IN_MONTHS = 6;
/** Days a pre-approval gives you to find a home and sign a contract (Housing Australia). */
export const HG_PREAPPROVAL_DAYS = 90;
/** Principal and interest owner-occupier loan, term in years, plus up to 3 years to build (s29C(2)(k), (3); fact sheet). */
export const HG_MAX_TERM_YEARS = 30;

export interface GuaranteeCaps {
  /** The Greater Capital City Statistical Area, plus the state's regional centres. */
  capital: number;
  /** The rest of the state or territory; null for the ACT, which has one cap. */
  rest: number | null;
  /** ABS SA4 regions that take the capital-city cap (Direction s4A(2)). */
  regionalCentres: readonly string[];
}

/** Property price caps for a guarantee issued now (Direction s29F(1)). The purchase price and the lender's valuation must both be at or under the cap. */
export const HG_PRICE_CAPS = {
  NSW: {
    capital: 1_500_000,
    rest: 800_000,
    regionalCentres: ["Central Coast", "Coffs Harbour–Grafton", "Illawarra", "Mid North Coast", "Newcastle and Lake Macquarie", "Richmond–Tweed"],
  },
  VIC: { capital: 950_000, rest: 650_000, regionalCentres: ["Geelong"] },
  QLD: { capital: 1_000_000, rest: 700_000, regionalCentres: ["Gold Coast", "Sunshine Coast"] },
  WA: { capital: 850_000, rest: 600_000, regionalCentres: [] },
  SA: { capital: 900_000, rest: 500_000, regionalCentres: [] },
  TAS: { capital: 700_000, rest: 550_000, regionalCentres: [] },
  ACT: { capital: 1_000_000, rest: null, regionalCentres: [] },
  NT: { capital: 750_000, rest: 600_000, regionalCentres: [] },
} as const satisfies Record<AustralianState, GuaranteeCaps>;

/** The single Northern Territory cap from 1 October 2025 until Darwin's was raised on HG_DATES.ntCapSplit (F2025L00984 item 9). */
export const HG_NT_CAP_BEFORE_SPLIT = 600_000;

/** Caps for the external territories (s29F(1) items 15 and 16). */
export const HG_OTHER_TERRITORY_CAPS = [
  { area: "Jervis Bay Territory and Norfolk Island", cap: 550_000 },
  { area: "Christmas Island and Cocos (Keeling) Islands", cap: 400_000 },
] as const;

/** The capital-city area each cap applies to: the ABS Greater Capital City Statistical Area (s4A(1)). */
export const HG_CAPITAL_AREAS: Record<AustralianState, string> = {
  NSW: "Greater Sydney", VIC: "Greater Melbourne", QLD: "Greater Brisbane", WA: "Greater Perth",
  SA: "Greater Adelaide", TAS: "Greater Hobart", ACT: "the ACT", NT: "Greater Darwin",
};

const REST_OF: Record<AustralianState, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia",
  SA: "South Australia", TAS: "Tasmania", ACT: "the ACT", NT: "the Northern Territory",
};

export const fmtCap = (n: number) => `$${n.toLocaleString("en-AU")}`;

export function hgPriceCap(state: AustralianState, area: "capital" | "rest"): number {
  const c = HG_PRICE_CAPS[state];
  return area === "rest" && c.rest !== null ? c.rest : c.capital;
}

/** The areas that take the capital-city cap, in words: "Greater Melbourne and Geelong". */
export function hgCapitalAreaLabel(state: AustralianState): string {
  const { regionalCentres } = HG_PRICE_CAPS[state];
  const capital = HG_CAPITAL_AREAS[state];
  if (regionalCentres.length === 0) return capital;
  if (regionalCentres.length === 1) return `${capital} and ${regionalCentres[0]}`;
  return `${capital} and the regional centres (${regionalCentres.join(", ")})`;
}

/** "$700,000 in Greater Hobart and $550,000 in the rest of Tasmania" */
export function hgCapSentence(state: AustralianState): string {
  const c = HG_PRICE_CAPS[state];
  if (c.rest === null) return `${fmtCap(c.capital)} across ${REST_OF[state]}`;
  return `${fmtCap(c.capital)} in ${hgCapitalAreaLabel(state)} and ${fmtCap(c.rest)} in the rest of ${REST_OF[state]}`;
}
