// The Australian Government Help to Buy scheme's rules, for
// /guides/help-to-buy-scheme-australia, the state Help to Buy pages, the
// shared equity schemes guide and /help-to-buy-calculator (Help to Buy plan,
// 7 Oct 2026; research in docs/seo-baselines/2026-10-06/help-to-buy). Every
// figure is from Housing Australia (firsthomebuyers.gov.au), the Help to Buy
// Program Directions 2025 or a state government page, read on
// HTB_CHECKED_ON. Income limits are indexed each 1 July and new places are
// released then, so recheck every July; price caps change only by a
// government decision.
import type { AustralianState } from "@/lib/utils/stamp-duty";

export const HTB_CHECKED_ON = "2026-10-07";
/** The scheme year the income limits below apply to. */
export const HTB_YEAR = "2026–27";

export interface Source {
  label: string;
  href: string;
}

export const HTB_SOURCES = {
  scheme: { label: "Housing Australia: Australian Government Help to Buy scheme", href: "https://firsthomebuyers.gov.au/australian-government-help-buy-scheme" },
  thresholds: { label: "Housing Australia: 2026–27 income and threshold updates", href: "https://firsthomebuyers.gov.au/HTB-thresholds" },
  faq: { label: "Housing Australia: Help to Buy FAQs", href: "https://firsthomebuyers.gov.au/frequently-asked-questions-2" },
  factSheet: { label: "Housing Australia: Help to Buy fact sheet (1 July 2026)", href: "https://firsthomebuyers.gov.au/HTBFactSheet" },
  customerGuide: { label: "Housing Australia: Help to Buy customer guide (1 July 2026)", href: "https://firsthomebuyers.gov.au/helptobuycustomerguide" },
  priceCaps: { label: "Housing Australia: Help to Buy property price caps", href: "https://firsthomebuyers.gov.au/help-buy-tools-and-resources/help-buy-property-price-caps" },
  lenders: { label: "Housing Australia: Help to Buy participating lenders", href: "https://firsthomebuyers.gov.au/australian-government-help-buy-scheme/help-buy-tools-and-resources/help-buy-participating-lenders" },
  directions: { label: "Help to Buy Program Directions 2025", href: "https://www.legislation.gov.au/F2025L00682/asmade/text" },
  launch: { label: "Housing Australia: Applications now open (5 Dec 2025)", href: "https://www.housingaustralia.gov.au/media/applications-now-open-australian-government-help-buy-scheme" },
  wa: { label: "Housing Australia: Help to Buy now available in Western Australia (22 Dec 2025)", href: "https://www.housingaustralia.gov.au/media/australian-government-help-buy-scheme-now-available-western-australia" },
  tas: { label: "Housing Australia: Help to Buy now available in Tasmania (5 Jun 2026)", href: "https://www.housingaustralia.gov.au/media/australian-government-help-buy-scheme-now-available-tasmania" },
  july2026: { label: "Housing Australia: Help to Buy expands from 1 July 2026", href: "https://www.housingaustralia.gov.au/media/more-australians-set-benefit-help-buy-expands-1-july-2026" },
} as const satisfies Record<string, Source>;

/** The government's equity share, as a % of the price (Directions s16). */
export const HTB_SHARE = {
  existing: { min: 5, max: 30 },
  new: { min: 5, max: 40 },
} as const;
/** Minimum deposit, % of the price; the buyer also puts in what the lender says they can reasonably afford. */
export const HTB_MIN_DEPOSIT_PCT = 2;
/** The government's share plus the deposit must reach at least this % of the value, so no LMI applies (Directions s16(2)). */
export const HTB_COMBINED_MIN_PCT = 20;
/** Each voluntary repayment of the government's share: at least this % of the home's current value, or the whole share (Directions s43). */
export const HTB_MIN_REPAYMENT_PCT = 5;
/** Renovations at or above this in 12 months must be notified so the owner keeps the added value (from 1 July 2026; was $20,000). */
export const HTB_RENOVATION_NOTICE = 21_000;

export type Household = "single" | "joint" | "singleParent";

/** Taxable income limits from 1 July 2026, on the most recent ATO notice of assessment. */
export const HTB_INCOME_LIMITS: Record<Household, number> = {
  single: 103_000,
  joint: 165_000,
  singleParent: 165_000,
};
export const HTB_INCOME_LIMITS_PREVIOUS = { single: 100_000, joint: 160_000, to: "30 June 2026" } as const;
export const HOUSEHOLD_LABELS: Record<Household, string> = {
  single: "Single",
  joint: "Couple (joint application)",
  singleParent: "Single parent",
};

export const HTB_PLACES = { perYear: 10_000, totalCap: 40_000 } as const;

export const HTB_DATES = {
  launched: "5 December 2025",
  waFrom: "22 December 2025",
  tasFrom: "9 June 2026",
  incomeLimitsFrom: "1 July 2026",
} as const;

export type CapArea = "capital" | "rest";

export interface StateCaps {
  /** Capital city, plus the named regional centres where the state has them. */
  capital: number;
  /** Rest of the state; null where the territory has no rest-of-state area (ACT). */
  rest: number | null;
  /** Regional centres that take the capital-city cap. */
  regionalCentres: readonly string[];
}

/** Property price caps (Directions s7), unchanged since 13 June 2025 and not indexed. */
export const HTB_PRICE_CAPS: Record<AustralianState, StateCaps> = {
  NSW: {
    capital: 1_300_000,
    rest: 800_000,
    regionalCentres: ["Newcastle and Lake Macquarie", "Illawarra", "Central Coast", "Mid-North Coast", "Coffs Harbour–Grafton", "Richmond–Tweed"],
  },
  VIC: { capital: 950_000, rest: 650_000, regionalCentres: ["Geelong"] },
  QLD: { capital: 1_000_000, rest: 700_000, regionalCentres: ["Gold Coast", "Sunshine Coast"] },
  WA: { capital: 850_000, rest: 600_000, regionalCentres: [] },
  SA: { capital: 900_000, rest: 500_000, regionalCentres: [] },
  TAS: { capital: 700_000, rest: 550_000, regionalCentres: [] },
  ACT: { capital: 1_000_000, rest: null, regionalCentres: [] },
  NT: { capital: 600_000, rest: 600_000, regionalCentres: [] },
};

export const STATE_CAPITALS: Record<AustralianState, string> = {
  NSW: "Sydney", VIC: "Melbourne", QLD: "Brisbane", WA: "Perth", SA: "Adelaide", TAS: "Hobart", ACT: "Canberra", NT: "Darwin",
};

export function priceCap(state: AustralianState, area: CapArea): number {
  const c = HTB_PRICE_CAPS[state];
  return area === "rest" && c.rest !== null ? c.rest : c.capital;
}

export interface Lender {
  name: string;
  since: string;
  note?: string;
  href: string;
}

/** Housing Australia's participating lenders list, read on HTB_CHECKED_ON. */
export const HTB_LENDERS: readonly Lender[] = [
  { name: "Bank Australia", since: "5 December 2025", href: "https://www.bankaust.com.au/banking/home-loans/help-to-buy" },
  { name: "Commonwealth Bank", since: "5 December 2025", href: "https://www.commbank.com.au/home-loans/australian-government-help-to-buy-scheme.html" },
  {
    name: "Teachers Mutual Bank Limited",
    since: "27 July 2026",
    note: "Also as Health Professionals Bank, Firefighters Mutual Bank and UniBank; through brokers from 6 October 2026",
    href: "https://www.tmbank.com.au/home-loans/help-to-buy-scheme",
  },
  { name: "Queensland Country Bank", since: "6 October 2026", note: "Branch and broker", href: "https://www.queenslandcountry.bank/help-to-buy" },
];

export type SchemeStatus = "open" | "closed" | "limited";

export interface StateScheme {
  name: string;
  state: AustralianState | "national";
  status: SchemeStatus;
  /** One-line status as the official page states it. */
  statusNote: string;
  /** Headline terms, where the scheme is open. */
  terms?: string;
  source: Source;
}

/**
 * Shared equity schemes and their status, read on HTB_CHECKED_ON. None can
 * be combined with Help to Buy (Directions s17(d), Sch 1 cl 1.6).
 */
export const SHARED_EQUITY_SCHEMES: readonly StateScheme[] = [
  {
    name: "Help to Buy",
    state: "national",
    status: "open",
    statusNote: "Open in every state and territory since 9 June 2026",
    terms: "Up to 40% of a new home or 30% of an existing one; 2% deposit; income limits $103,000 single, $165,000 joint or single parent",
    source: HTB_SOURCES.scheme,
  },
  {
    name: "Boost to Buy",
    state: "QLD",
    status: "limited",
    statusNote: "Round 2 open with up to 500 places; South East Queensland appointments are all taken, so regional places only",
    terms: "Up to 30% of a new home or 25% of an existing one; 2% deposit; $1 million price cap; income limits $155,000 single, $232,000 couples or with dependants",
    source: { label: "Queensland Treasury: Boost to Buy", href: "https://www.treasury.qld.gov.au/policies-and-programs/home-ownership/boost-to-buy/overview/" },
  },
  {
    name: "Keystart shared ownership",
    state: "WA",
    status: "open",
    statusNote: "SharedStart, GoodStart and Sole Parent loans offered; Urban Connect Shared Equity launched 8 October 2025",
    terms: "Urban Connect: new apartments and townhouses up to $730,000, government share up to 35% or $250,000",
    source: { label: "Keystart: Shared ownership home loan", href: "https://www.keystart.com.au/loans/shared-ownership-home-loan" },
  },
  {
    name: "HomeStart Shared Equity Option",
    state: "SA",
    status: "open",
    statusNote: "Offered",
    terms: "A 5% to 25% share; net household income up to $120,000; $750,000 price cap",
    source: { label: "HomeStart: Shared equity option", href: "https://www.homestart.com.au/home-loans/additional-loans-and-options/shared-equity-option" },
  },
  {
    name: "MyHome",
    state: "TAS",
    status: "open",
    statusNote: "Open, applications through Bank of us",
    terms: "Up to 40% or $300,000 of a new home, up to 30% or $150,000 of an existing one; price caps $800,000 new, $750,000 existing",
    source: { label: "Homes Tasmania: MyHome", href: "https://www.homestasmania.com.au/Buying-a-Home/MyHome" },
  },
  {
    name: "Victorian Homebuyer Fund",
    state: "VIC",
    status: "closed",
    statusNote: "Closed to new applications on 10 September 2025",
    source: { label: "State Revenue Office Victoria: Victorian Homebuyer Fund", href: "https://www.sro.vic.gov.au/about-us/our-organisation/closed-taxes-levies-and-grants/victorian-homebuyer-fund" },
  },
  {
    name: "Shared Equity Home Buyer Helper",
    state: "NSW",
    status: "closed",
    statusNote: "Closed on 30 June 2024",
    source: { label: "Revenue NSW: Shared Equity Home Buyer Helper", href: "https://www.revenue.nsw.gov.au/grants-schemes/previous-schemes/shared-equity-home-buyer-helper" },
  },
];

/** Housing Australia's 1 July 2026 release, the latest published uptake. */
export const HTB_UPTAKE = {
  asAt: "1 July 2026",
  applications: 7_200,
  foundOrSettled: 4_800,
  medianDeposit: 30_000,
  singlePct: 70,
  singleParentPct: 12,
  firstHomeBuyerPct: 86,
  strongestDemand: ["Victoria", "New South Wales", "Queensland"],
  source: HTB_SOURCES.july2026,
} as const;
