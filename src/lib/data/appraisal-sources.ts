// Sourced facts the appraisal and valuation pages repeat: what a valuation
// costs, that an agent's appraisal is commonly free, and the state rules on
// an agent's price estimate. One file, so a figure changes in one place; the
// agents pages, /appraisal, /property-valuation and the house-worth guide
// render from it. Every entry names its page and the date it was read.
// Tested in tests/lib/appraisal-sources.test.ts, which fails when a page
// types one of these figures by hand.

export interface SourceRef {
  label: string;
  href: string;
  /** The page's own date where it shows one. */
  updated?: string;
  /** When we read it. */
  read: string;
}

/** What a valuation by a licensed valuer typically costs. */
export const VALUATION_COST = {
  low: 300,
  high: 600,
  source: {
    label: "ANZ: Getting a property valuation, what it is and when you might need one",
    href: "https://www.anz.com.au/personal/home-loans/tips-and-guides/property-valuation-what-it-is-and-when-you-might-need-one/",
    read: "11 October 2026",
  } satisfies SourceRef,
  /** ANZ's words: "Most valuations typically cost between $300 to $600." */
  quote: "Most valuations typically cost between $300 to $600",
} as const;

/**
 * Aussie's guide, updated 1 October 2026: "a standard residential valuation
 * may cost around $300 to $600", "Real estate agents commonly offer property
 * appraisals at no cost", and the Australian Property Institute's 2026
 * indicative fees including GST by type of valuation (as Aussie reports them;
 * the API's own schedule was not found online on 11 Oct 2026).
 */
export const AUSSIE_GUIDE: SourceRef = {
  label: "Aussie: Property appraisals vs valuations, what's the difference?",
  href: "https://www.aussie.com.au/insights/articles/property-appraisals-vs-valuations-difference/",
  updated: "1 October 2026",
  read: "11 October 2026",
};

export const API_INDICATIVE_FEES_2026: readonly { kind: string; low: number; high: number }[] = [
  { kind: "Desktop valuation", low: 220, high: 385 },
  { kind: "Kerbside valuation", low: 330, high: 495 },
  { kind: "Full residential valuation", low: 440, high: 880 },
];

/** NSW: the agency agreement's estimated selling price, and the commission warning. */
export const NSW_AGENCY_AGREEMENTS: SourceRef = {
  label: "NSW Government: Agency agreements for the sale of property in NSW",
  href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements",
  updated: "8 July 2026",
  read: "11 October 2026",
};

/** Victoria: the agent's estimated selling price and the Property Price Statement. */
export const CAV_PROPERTY_PRICES: SourceRef = {
  label: "Consumer Affairs Victoria: Understanding property prices and underquoting for buyers",
  href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/understanding-property-prices-and-underquoting-for-buyers",
  updated: "1 October 2026",
  read: "11 October 2026",
};

/** Queensland: what the appointment of an agent must say about commission. */
export const QLD_COMMISSION: SourceRef = {
  label: "Queensland Government: Charging commission for selling and letting in the property industry",
  href: "https://www.qld.gov.au/community/fair-trading/regulated-industries-licensing-and-legislation/property-industry-regulation/legal-requirements-for-the-property-industry/charging-commission-for-selling-and-letting-in-the-property-industry",
  updated: "20 October 2020",
  read: "11 October 2026",
};

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

/** "$300 to $600". */
export function valuationCostRange(): string {
  return `${money(VALUATION_COST.low)} to ${money(VALUATION_COST.high)}`;
}

/** "$300 to $600 (ANZ, read 11 October 2026)". */
export function valuationCostCited(): string {
  return `${valuationCostRange()} (ANZ, read ${VALUATION_COST.source.read})`;
}

/** "(NSW Government, Agency agreements, updated 8 July 2026)" style short citation. */
export function cite(src: SourceRef, short: string): string {
  return `${short}, ${src.updated ? `updated ${src.updated}` : `read ${src.read}`}`;
}
