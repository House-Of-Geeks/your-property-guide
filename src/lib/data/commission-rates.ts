// Real estate commission by state: one sourced table for the commission
// calculator, the state commission guides, the national fees guide, the
// selling-cost tables and the agents pages (commercial-intent review,
// 10 Oct 2026, selling 0.1 and 0.3; tracker item 9).
//
// No state or territory sets a commission rate. Every figure here is a
// published average or median from a named, dated source:
// - OpenAgent's region pages: the average commission rate for each state,
//   its capital and each regional area OpenAgent publishes (pages last
//   updated September 2026).
// - bRight Agent's Real Estate Agent Commission Rates 2026 State of the
//   States Report: the median across more than 200 postcodes, by state, as
//   reported by Real Estate Business on 16 February 2026.
// Where neither publishes a regional figure, the page says "No published
// range". Nothing here is a survey of our own. The rules column is sourced
// to the regulator or the legislation. If a source moves, change it here
// once: STATE_RATES and the national figures are derived, not typed.

export type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

/** The date the sources below were read. */
export const COMMISSION_AS_AT = "11 October 2026";

export type CommissionSourceKey =
  | "oa-nsw"
  | "oa-vic"
  | "oa-qld"
  | "oa-wa"
  | "oa-sa"
  | "oa-tas"
  | "oa-act"
  | "oa-nt"
  | "bright"
  | "nsw-agency"
  | "cav"
  | "qld-commissions"
  | "reiq"
  | "reiwa"
  | "sa-gov"
  | "tas-pab"
  | "act-reg"
  | "nt-gov"
  | "ato-gst";

export interface CommissionSource {
  /** Footnote number printed under the table, in this order. */
  n: number;
  label: string;
  href: string;
  /** The publication or last-updated date as the source shows it, and the date we read it. */
  date: string;
}

const READ = `read ${COMMISSION_AS_AT}`;
const OA_DATE = `last updated September 2026, ${READ}`;

export const COMMISSION_SOURCES: Record<CommissionSourceKey, CommissionSource> = {
  "oa-nsw": { n: 1, label: "OpenAgent, Real estate agents in NSW: average commission rate for NSW, Sydney and each NSW region", href: "https://www.openagent.com.au/real-estate-agents/nsw", date: OA_DATE },
  "oa-vic": { n: 2, label: "OpenAgent, Real estate agents in VIC: average commission rate for Victoria, Melbourne and each Victorian region", href: "https://www.openagent.com.au/real-estate-agents/vic", date: OA_DATE },
  "oa-qld": { n: 3, label: "OpenAgent, Real estate agents in QLD: average commission rate for Queensland, Brisbane and each Queensland region", href: "https://www.openagent.com.au/real-estate-agents/qld", date: OA_DATE },
  "oa-wa": { n: 4, label: "OpenAgent, Real estate agents in WA: average commission rate for WA, Perth and each WA region", href: "https://www.openagent.com.au/real-estate-agents/wa", date: OA_DATE },
  "oa-sa": { n: 5, label: "OpenAgent, Real estate agents in SA: average commission rate for South Australia, Adelaide and South East SA", href: "https://www.openagent.com.au/real-estate-agents/sa", date: OA_DATE },
  "oa-tas": { n: 6, label: "OpenAgent, Real estate agents in TAS: average commission rate for Tasmania, Hobart and each Tasmanian region", href: "https://www.openagent.com.au/real-estate-agents/tas", date: OA_DATE },
  "oa-act": { n: 7, label: "OpenAgent, Real estate agents in ACT: average commission rate for the ACT and Canberra", href: "https://www.openagent.com.au/real-estate-agents/act", date: OA_DATE },
  "oa-nt": { n: 8, label: "OpenAgent, Real estate agents in NT: average commission rate for the NT and Darwin", href: "https://www.openagent.com.au/real-estate-agents/nt", date: OA_DATE },
  bright: { n: 9, label: "bRight Agent, Real Estate Agent Commission Rates 2026 State of the States Report (median of more than 200 postcodes), as reported by Real Estate Business, \"Agent fees: Who charges the most?\"", href: "https://www.realestatebusiness.com.au/sales/31380-agent-fees-who-charges-the-most", date: `16 February 2026, ${READ}` },
  "nsw-agency": { n: 10, label: "NSW Government, Agency agreements for the sale of property in NSW (the agreement states the fees or commission; you can negotiate them; cooling-off ends 5 pm the next business day or Saturday)", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements", date: `last updated 8 July 2026, ${READ}` },
  cav: { n: 11, label: "Consumer Affairs Victoria, Authorities, rebates and commission (the agent must tell you commission and expenses are negotiable before you sign)", href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/running-your-business/authorities-commissions-and-contracts/authorities-rebates-and-commission", date: `last updated 12 October 2023, ${READ}` },
  "qld-commissions": { n: 12, label: "Queensland Government, Commissions (the commission must be set in writing when you appoint your agent)", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/selling-a-home/before-you-put-your-home-on-the-market/commissions-and-costs", date: `last updated 29 October 2020, ${READ}` },
  reiq: { n: 13, label: "REIQ, No such thing as 'standard' commission (maximum rates deregulated in 2014; the Form 6 states a GST-inclusive amount)", href: "https://www.reiq.com/articles/no-standard-commission-queensland", date: `15 April 2021, ${READ}` },
  reiwa: { n: 14, label: "REIWA, Agent fees FAQ (government regulations do not fix agents' fees; the level is by agreement)", href: "https://reiwa.com.au/the-wa-market/resources/faqs/agent-fees/", date: READ },
  "sa-gov": { n: 15, label: "SA Government (Consumer and Business Services), Hiring a professional for house and land sales (commission, a set fee or both; fees and terms can be negotiated; agreements up to 90 days)", href: "https://www.sa.gov.au/topics/housing-and-property/buying-building-selling/selling-a-property/engaging-professionals", date: READ },
  "tas-pab": { n: 16, label: "Property Agents Board of Tasmania, About us (the statutory authority that regulates agents under the Property Agents and Land Transactions Act 2016; its pages publish no commission scale)", href: "https://propertyagentsboard.com.au/about-us/", date: READ },
  "act-reg": { n: 17, label: "Agents Regulation 2003 (ACT), schedule 3, section 3.9 (the agreement states the commission, and for a percentage the dollar amount at an estimated sale price)", href: "https://www.legislation.act.gov.au/sl/2003-38/", date: `republication 23, effective 13 September 2024, ${READ}` },
  "nt-gov": { n: 18, label: "NT Government, Dealing with a real estate agent (the agreement sets out the fees or commission; you can negotiate the amount)", href: "https://nt.gov.au/property/buying-and-selling-a-home/ways-to-buy-or-sell-a-home/dealing-with-a-real-estate-agent", date: READ },
  "ato-gst": { n: 19, label: "ATO, How GST works (GST is a broad-based tax of 10% on most goods and services)", href: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/how-gst-works", date: `last updated 14 September 2026, ${READ}` },
};

/** Sources in footnote order, for the list under a table and the Sources block. */
export const COMMISSION_SOURCE_LIST: CommissionSource[] = (Object.keys(COMMISSION_SOURCES) as CommissionSourceKey[])
  .map((k) => COMMISSION_SOURCES[k])
  .sort((a, b) => a.n - b.n);

/** One published average: a capital or a regional area, with the page that publishes it. */
export interface AreaAverage {
  name: string;
  /** Percent of the sale price. */
  rate: number;
  href: string;
}

export interface StateCommission {
  state: StateCode;
  capital: AreaAverage;
  /** OpenAgent's average for the whole state. */
  stateAverage: number;
  /** OpenAgent's regional areas outside the capital that carry a published average. */
  regions: AreaAverage[];
  /** OpenAgent regional areas that publish no figure (named so the page can say so). */
  regionsWithoutFigure: string[];
  /** bRight Agent's 2026 median for the state. */
  median: number;
  /** The OpenAgent source for this state. */
  openAgent: CommissionSourceKey;
  /** What the state's law or regulator says about commission, in one or two sentences. */
  rule: string;
  ruleSources: CommissionSourceKey[];
}

const oa = (path: string) => `https://www.openagent.com.au/real-estate-agents/${path}`;

export const STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const STATE_COMMISSION: Record<StateCode, StateCommission> = {
  NSW: {
    state: "NSW",
    capital: { name: "Sydney", rate: 1.64, href: oa("nsw/sydney") },
    stateAverage: 1.88,
    regions: [
      { name: "Capital Region", rate: 2.1, href: oa("nsw/capital-region") },
      { name: "Central Coast", rate: 1.99, href: oa("nsw/central-coast") },
      { name: "Central West NSW", rate: 2.71, href: oa("nsw/central-west-nsw") },
      { name: "Hunter Region", rate: 2.06, href: oa("nsw/hunter-region") },
      { name: "Mid North Coast", rate: 2.35, href: oa("nsw/mid-north-coast") },
      { name: "Northern Rivers", rate: 2.4, href: oa("nsw/northern-rivers") },
      { name: "South Coast NSW", rate: 1.92, href: oa("nsw/south-coast-nsw") },
      { name: "South West NSW", rate: 2.4, href: oa("nsw/south-west-nsw") },
      { name: "Western NSW", rate: 2.85, href: oa("nsw/western-nsw") },
    ],
    regionsWithoutFigure: [],
    median: 2.35,
    openAgent: "oa-nsw",
    rule: "No NSW law sets the rate. The agency agreement must state the fees or commission, you can negotiate the amounts, and you can cancel the agreement until 5 pm on the next business day or Saturday after signing.",
    ruleSources: ["nsw-agency"],
  },
  VIC: {
    state: "VIC",
    capital: { name: "Melbourne", rate: 1.78, href: oa("vic/melbourne") },
    stateAverage: 1.83,
    regions: [
      { name: "Central Highlands", rate: 1.98, href: oa("vic/central-highlands") },
      { name: "Gippsland", rate: 2.07, href: oa("vic/gippsland") },
      { name: "Goulburn Valley", rate: 2.22, href: oa("vic/goulburn-valley") },
      { name: "Grampians", rate: 2.79, href: oa("vic/grampians") },
      { name: "South West Victoria", rate: 1.82, href: oa("vic/south-west-victoria") },
    ],
    regionsWithoutFigure: [],
    median: 2.35,
    openAgent: "oa-vic",
    rule: "No Victorian law sets the rate. The agent must tell you that commission and expenses are negotiable before you sign the authority, and cannot claim commission without a written authority that meets the Estate Agents Act 1980.",
    ruleSources: ["cav"],
  },
  QLD: {
    state: "QLD",
    capital: { name: "Brisbane", rate: 2.41, href: oa("qld/brisbane") },
    stateAverage: 2.5,
    regions: [
      { name: "South East Queensland", rate: 2.33, href: oa("qld/south-east-queensland") },
      { name: "Far North Queensland", rate: 2.6, href: oa("qld/far-north-queensland") },
      { name: "Wide Bay", rate: 2.62, href: oa("qld/wide-bay") },
      { name: "North Queensland", rate: 2.73, href: oa("qld/north-queensland") },
      { name: "Darling Downs", rate: 2.76, href: oa("qld/darling-downs") },
      { name: "Central Queensland", rate: 2.91, href: oa("qld/central-queensland") },
    ],
    regionsWithoutFigure: ["Western Queensland"],
    median: 2.8,
    openAgent: "oa-qld",
    rule: "Queensland deregulated maximum commission in 2014. The commission must be set in writing when you appoint the agent on the Form 6, as a GST-inclusive amount, and it is negotiable.",
    ruleSources: ["qld-commissions", "reiq"],
  },
  WA: {
    state: "WA",
    capital: { name: "Perth", rate: 2.06, href: oa("wa/perth") },
    stateAverage: 2.14,
    regions: [
      { name: "Wheatbelt", rate: 2.73, href: oa("wa/wheatbelt") },
      { name: "North West WA", rate: 2.93, href: oa("wa/north-west-wa") },
      { name: "South West WA", rate: 3.23, href: oa("wa/south-west-wa") },
      { name: "South WA", rate: 3.25, href: oa("wa/south-wa") },
    ],
    regionsWithoutFigure: [],
    median: 2.75,
    openAgent: "oa-wa",
    rule: "Government regulations do not fix WA agents' fees: the level is by agreement between you and the agent.",
    ruleSources: ["reiwa"],
  },
  SA: {
    state: "SA",
    capital: { name: "Adelaide", rate: 1.71, href: oa("sa/adelaide") },
    stateAverage: 1.82,
    regions: [{ name: "South East SA", rate: 2.29, href: oa("sa/south-east-sa") }],
    regionsWithoutFigure: [],
    median: 2.9,
    openAgent: "oa-sa",
    rule: "The agent may charge a commission, a set fee or both. Fees and terms in the sales agency agreement can be negotiated, and the agreement runs for up to 90 days.",
    ruleSources: ["sa-gov"],
  },
  TAS: {
    state: "TAS",
    capital: { name: "Hobart", rate: 2.26, href: oa("tas/hobart") },
    stateAverage: 2.38,
    regions: [
      { name: "Launceston and North East", rate: 2.42, href: oa("tas/launceston-and-north-east-tas") },
      { name: "South East", rate: 2.53, href: oa("tas/south-east-tas") },
      { name: "West and North West", rate: 2.53, href: oa("tas/west-and-north-west-tas") },
    ],
    regionsWithoutFigure: [],
    median: 3.25,
    openAgent: "oa-tas",
    rule: "The Property Agents Board regulates agents under the Property Agents and Land Transactions Act 2016 and publishes no commission scale, so the rate is what your agreement says.",
    ruleSources: ["tas-pab"],
  },
  ACT: {
    state: "ACT",
    capital: { name: "Canberra", rate: 1.78, href: oa("act/canberra") },
    stateAverage: 1.78,
    regions: [],
    regionsWithoutFigure: [],
    median: 2.23,
    openAgent: "oa-act",
    rule: "No ACT law sets the rate. The agency agreement must state the commission or how it is worked out and, for a percentage, the dollar amount at a stated estimated sale price.",
    ruleSources: ["act-reg"],
  },
  NT: {
    state: "NT",
    capital: { name: "Darwin", rate: 2.47, href: oa("nt/darwin") },
    stateAverage: 2.48,
    regions: [],
    regionsWithoutFigure: ["Outback NT"],
    median: 3.0,
    openAgent: "oa-nt",
    rule: "The agreement sets out the fees or commission you agree to pay, and you can negotiate the amount with the agent.",
    ruleSources: ["nt-gov"],
  },
};

export interface CommissionRange {
  /** The lowest published average or median for the state (capital, regions, state median). */
  low: number;
  /** The highest published average or median for the state. */
  high: number;
  /** OpenAgent's state average: the calculators' default rate. */
  typical: number;
}

/** Every published figure for a state: capital, regions, state average and median. */
export function publishedFigures(state: StateCode): number[] {
  const s = STATE_COMMISSION[state];
  return [s.capital.rate, s.stateAverage, s.median, ...s.regions.map((r) => r.rate)];
}

function deriveRange(state: StateCode): CommissionRange {
  const figures = publishedFigures(state);
  return { low: Math.min(...figures), high: Math.max(...figures), typical: STATE_COMMISSION[state].stateAverage };
}

/**
 * The range and typical rate per state, derived from STATE_COMMISSION. The
 * range runs from the lowest to the highest published average or median in
 * the state; individual quotes can sit outside it.
 */
export const STATE_RATES: Record<StateCode, CommissionRange> = {
  NSW: deriveRange("NSW"),
  VIC: deriveRange("VIC"),
  QLD: deriveRange("QLD"),
  SA: deriveRange("SA"),
  WA: deriveRange("WA"),
  TAS: deriveRange("TAS"),
  NT: deriveRange("NT"),
  ACT: deriveRange("ACT"),
};

export const STATE_NAMES: Record<StateCode, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "the Northern Territory",
  ACT: "the ACT",
};

/** "1.64%", "2.1%", "3%": the figure as published, without trailing zeros. */
export const pct = (n: number) => `${Number(n.toFixed(2))}%`;

/** "1.64% to 2.85%", or one figure when both ends match. */
export const pctRange = (low: number, high: number) => (low === high ? pct(low) : `${pct(low)} to ${pct(high)}`);

export interface RegionalRange {
  low: number;
  high: number;
  count: number;
}

/** The span of OpenAgent's regional averages for a state, or null where none is published. */
export function regionalRange(state: StateCode): RegionalRange | null {
  const rates = STATE_COMMISSION[state].regions.map((r) => r.rate);
  if (rates.length === 0) return null;
  return { low: Math.min(...rates), high: Math.max(...rates), count: rates.length };
}

export interface CommissionCell {
  text: string;
  /** Footnote numbers, ascending. */
  refs: number[];
}

const refs = (keys: CommissionSourceKey[]): number[] =>
  [...new Set(keys.map((k) => COMMISSION_SOURCES[k].n))].sort((a, b) => a - b);

export const NO_PUBLISHED_RANGE = "No published range";

export function capitalCell(state: StateCode): CommissionCell {
  const s = STATE_COMMISSION[state];
  return { text: `${pct(s.capital.rate)} (${s.capital.name} average)`, refs: refs([s.openAgent]) };
}

export function regionalCell(state: StateCode): CommissionCell {
  const s = STATE_COMMISSION[state];
  const r = regionalRange(state);
  if (!r) return { text: NO_PUBLISHED_RANGE, refs: [] };
  const where = r.count === 1 ? s.regions[0].name : `${r.count} regional areas`;
  return { text: `${pctRange(r.low, r.high)} (${where})`, refs: refs([s.openAgent]) };
}

export function stateAverageCell(state: StateCode): CommissionCell {
  const s = STATE_COMMISSION[state];
  return { text: pct(s.stateAverage), refs: refs([s.openAgent]) };
}

export function medianCell(state: StateCode): CommissionCell {
  return { text: pct(STATE_COMMISSION[state].median), refs: refs(["bright"]) };
}

export function ruleCell(state: StateCode): CommissionCell {
  const s = STATE_COMMISSION[state];
  return { text: s.rule, refs: refs(s.ruleSources) };
}

/** The sources a state's row cites, in footnote order (OpenAgent, bRight Agent, the rule, the ATO). */
export function stateSources(state: StateCode): CommissionSource[] {
  const s = STATE_COMMISSION[state];
  const keys: CommissionSourceKey[] = [s.openAgent, "bright", ...s.ruleSources, "ato-gst"];
  return [...new Set(keys)].map((k) => COMMISSION_SOURCES[k]).sort((a, b) => a.n - b.n);
}

export interface NationalRange {
  /** The lowest published figure anywhere (a capital or regional average, or a state median). */
  low: number;
  lowWhere: string;
  /** The highest published figure anywhere. */
  high: number;
  highWhere: string;
  /** OpenAgent state averages: the lowest and highest. */
  averageLow: number;
  averageLowStates: StateCode[];
  averageHigh: number;
  averageHighStates: StateCode[];
  /** bRight Agent state medians: the lowest and highest, and the national median. */
  medianLow: number;
  medianHigh: number;
  nationalMedian: number;
}

/** bRight Agent's national median across all postcodes (Real Estate Business, 16 February 2026). */
export const NATIONAL_MEDIAN = 2.65;

function whereOf(value: number): string {
  const places: string[] = [];
  for (const st of STATE_ORDER) {
    const s = STATE_COMMISSION[st];
    if (s.capital.rate === value) places.push(s.capital.name);
    for (const r of s.regions) if (r.rate === value) places.push(`${r.name} (${st})`);
    if (s.median === value) places.push(`the ${st} median`);
  }
  return places.join(", ");
}

/**
 * Every national commission statement on the site comes from here, so the
 * pages cannot give five different national ranges again (0.3).
 */
export function nationalRange(): NationalRange {
  const all = STATE_ORDER.flatMap(publishedFigures);
  const low = Math.min(...all);
  const high = Math.max(...all);
  const averages = STATE_ORDER.map((s) => STATE_COMMISSION[s].stateAverage);
  const averageLow = Math.min(...averages);
  const averageHigh = Math.max(...averages);
  const medians = STATE_ORDER.map((s) => STATE_COMMISSION[s].median);
  return {
    low,
    lowWhere: whereOf(low),
    high,
    highWhere: whereOf(high),
    averageLow,
    averageLowStates: STATE_ORDER.filter((s) => STATE_COMMISSION[s].stateAverage === averageLow),
    averageHigh,
    averageHighStates: STATE_ORDER.filter((s) => STATE_COMMISSION[s].stateAverage === averageHigh),
    medianLow: Math.min(...medians),
    medianHigh: Math.max(...medians),
    nationalMedian: NATIONAL_MEDIAN,
  };
}

/** "1.64% to 3.25%": the national span of published averages and medians. */
export function nationalRangeText(): string {
  const n = nationalRange();
  return pctRange(n.low, n.high);
}

/** GST on commission, from the ATO. */
export const GST_RATE = 0.1;

/** Commission in whole dollars, before GST. */
export const commissionAmount = (price: number, rate: number) => Math.round((price * rate) / 100);

/** Commission in whole dollars, with 10% GST added. */
export const commissionWithGst = (price: number, rate: number) => Math.round(commissionAmount(price, rate) * (1 + GST_RATE));
