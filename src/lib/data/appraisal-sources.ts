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

/** Aussie's own words on the cost, as read on 11 October 2026. */
export const AUSSIE_VALUATION_QUOTE = "A standard residential valuation may cost around $300 to $600";

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

/**
 * Free online property value estimators, each described from its own page
 * as read on the date given. Listed alphabetically, not ranked: no source
 * compares their accuracy. Left out: realestate.com.au's realEstimate (its
 * site could not be opened to check on 11 Oct 2026; property.com.au's
 * PropTrack estimate is listed) and NAB (its former free report page now
 * redirects to a research hub with no report, 11 Oct 2026).
 */
export interface FreeEstimator {
  name: string;
  runBy: string;
  /** Whose model or data, as the page names it. */
  data: string;
  /** What you enter and how you get the figure. */
  access: string;
  /** What the page says the figure is, in its own words where quoted. */
  says: string;
  href: string;
  read: string;
}

export const FREE_ESTIMATORS: readonly FreeEstimator[] = [
  {
    name: "ANZ Property Profile Report",
    runBy: "ANZ (bank)",
    data: "PropTrack price range estimate",
    access: "Enter the property details and choose a report type; the report is emailed in minutes",
    says: "\"NOT a valuation which may be required to assess how much a bank is willing to lend you\"",
    href: "https://www.anz.com.au/personal/home-loans/calculators-tools/property-profile-reports/",
    read: "11 October 2026",
  },
  {
    name: "Aussie Property Report",
    runBy: "Aussie (mortgage broker)",
    data: "Not named on the page",
    access: "Enter an address; free; log in to see earlier reports",
    says: "\"Value estimates (as well as ranges)\"; Aussie's own guide calls an online estimate \"an initial indication\"",
    href: "https://www.aussie.com.au/property-report/",
    read: "11 October 2026",
  },
  {
    name: "CommBank Property Insights",
    runBy: "Commonwealth Bank (bank)",
    data: "Cotality",
    access: "Enter an address and the reason for the report; unlimited reports after an appointment with a home lending specialist",
    says: "\"The estimate is not a valuation\"; estimates \"do not include property inspections\"",
    href: "https://www.commbank.com.au/retail/netbank/home-buying/tools/property-insights",
    read: "11 October 2026",
  },
  {
    name: "Domain Home Price Guide",
    runBy: "Domain (property portal)",
    data: "Pricefinder, with state and territory sales records and agents' data",
    access: "Search any address on the website or app",
    says: "A price estimate range marked High, Medium or Low accuracy; \"less accurate if the property is unique\" or has few similar sales (help article, 26 May 2026)",
    href: "https://help.domain.com.au/hc/en-au/articles/360018043914-Home-Price-Guide-Property-Profile-overview-FAQ-s",
    read: "11 October 2026",
  },
  {
    name: "OpenAgent OpenEstimates",
    runBy: "OpenAgent",
    data: "\"Property databases\", not named, plus your own rating of the property's condition",
    access: "Enter an address and answer questions about the property; free",
    says: "\"Property price predictions are estimates, not valuations\"",
    href: "https://www.openagent.com.au/openestimates",
    read: "11 October 2026",
  },
  {
    name: "property.com.au",
    runBy: "property.com.au (property portal)",
    data: "PropTrack",
    access: "Search an address; no estimate where there is too little data",
    says: "Estimates \"serve as indicative guidelines\"",
    href: "https://help.property.com.au/hc/en-au/articles/8004304203673-Why-can-t-I-see-an-estimated-value-of-a-property",
    read: "11 October 2026",
  },
];

/** What a valuer may consider for a residential property, as Aussie lists it (updated 1 October 2026). */
export const VALUER_CONSIDERS: readonly string[] = [
  "Location and local market conditions",
  "Land and dwelling size",
  "Property layout, aspect and topography",
  "Features such as bedrooms, a pool or updated kitchen",
  "Building condition and structure",
  "Council zoning and planning restrictions",
  "Heritage status",
  "Damage or faults",
  "Relevant title information, caveats or encumbrances",
  "Property access",
];

/** NSW land values: the NSW Government's page, with its search. */
export const NSW_LAND_VALUES: SourceRef & { published: string; asAt: string } = {
  label: "NSW Government: Land values in NSW",
  href: "https://www.nsw.gov.au/housing-and-construction/land-values-nsw",
  read: "11 October 2026",
  published: "November 2025",
  asAt: "1 July 2025",
};
