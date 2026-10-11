// Property management fees by state: the table, the sources, the per-state
// answers and the FAQ on /guides/property-management-fees-australia
// (commercial intent review, 30 Sep 2026, section 3.7). One module so the
// table, the calculator defaults, the state sections and the FAQ cannot drift.
//
// Every figure carries a source key; the source list names the publisher and
// the date. Where a state has no published range for a line, the field is
// null and the page says so. Nothing here is a survey of our own.
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";

export const PM_FEES_AS_AT = "30 September 2026";

export type PmSourceKey =
  | "laf"
  | "reiq"
  | "wra-syd"
  | "wra-mel"
  | "wra-bne"
  | "wra-per"
  | "wra-adl"
  | "wra-hba"
  | "wra-cbr"
  | "nsw-agency"
  | "nsw-access"
  | "cav-manager"
  | "cav-entry"
  | "qld-fees"
  | "qld-poa"
  | "wa-cp"
  | "reiwa"
  | "sa-law"
  | "tas-cbos"
  | "act-gov"
  | "nt-ca"
  | "ato";

export interface PmSource {
  /** Footnote number printed under the table, in this order. */
  n: number;
  label: string;
  href: string;
  /** The publication or last-updated date as the source shows it, or the date we read it. */
  date: string;
}

export const PM_FEE_SOURCES: Record<PmSourceKey, PmSource> = {
  laf: {
    n: 1,
    label: "LocalAgentFinder, Property Management Fees Australia: 2026 Guide (state average management and letting fees)",
    href: "https://www.localagentfinder.com.au/blog/property-management-commission-fees",
    date: "13 March 2026",
  },
  reiq: {
    n: 2,
    label: "REIQ, Property management fees: an in-depth guide (metro and regional averages by state, table sourced to realestate.com.au)",
    href: "https://www.reiq.com/articles/property-management/property-management-fees-an-in-depth-guide-to-understanding-the-costs-and-benefits",
    date: "1 December 2023",
  },
  "wra-syd": {
    n: 3,
    label: "WhichRealEstateAgent, Sydney Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/nsw-sydney/",
    date: "updated 19 March 2026",
  },
  "wra-mel": {
    n: 4,
    label: "WhichRealEstateAgent, Melbourne Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/vic-melbourne/",
    date: "2026 edition, read 30 September 2026",
  },
  "wra-bne": {
    n: 5,
    label: "WhichRealEstateAgent, Brisbane Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/qld-brisbane/",
    date: "2026 edition, read 30 September 2026",
  },
  "wra-per": {
    n: 6,
    label: "WhichRealEstateAgent, Perth Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/wa-perth/",
    date: "2026 edition, read 30 September 2026",
  },
  "wra-adl": {
    n: 7,
    label: "WhichRealEstateAgent, Adelaide Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/sa-adelaide/",
    date: "updated 19 March 2026",
  },
  "wra-hba": {
    n: 8,
    label: "WhichRealEstateAgent, Hobart Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/tas-hobart/",
    date: "2026 edition, read 30 September 2026",
  },
  "wra-cbr": {
    n: 9,
    label: "WhichRealEstateAgent, Canberra Property Management Fees 2026 Guide",
    href: "https://whichrealestateagent.com.au/property-management/fees/act-canberra/",
    date: "2026 edition, read 30 September 2026",
  },
  "nsw-agency": {
    n: 10,
    label: "NSW Government, Agency agreements (Property and Stock Agents Act 2002, section 55: signed copy within 48 hours)",
    href: "https://www.nsw.gov.au/housing-and-construction/property-professionals/working-as-an-agent/agency-agreements",
    date: "read 30 September 2026",
  },
  "nsw-access": {
    n: 11,
    label: "NSW Government, Minimum notice periods for access to rental property (Residential Tenancies Act 2010: up to four inspections in 12 months)",
    href: "https://www.nsw.gov.au/housing-and-construction/rules/minimum-notice-periods-for-access-to-rental-property",
    date: "read 30 September 2026",
  },
  "cav-manager": {
    n: 12,
    label: "Consumer Affairs Victoria, Using a property manager or real estate agent",
    href: "https://www.consumer.vic.gov.au/housing/renting/starting-and-changing-rental-agreements/using-a-property-manager-or-agent",
    date: "23 April 2025",
  },
  "cav-entry": {
    n: 13,
    label: "Consumer Affairs Victoria, When a rental provider can enter a property (general inspection once every six months, not in the first three)",
    href: "https://www.consumer.vic.gov.au/housing/renting/rental-providers-inspecting-or-entering-a-property/when-a-rental-provider-can-enter-a-property",
    date: "last updated 23 April 2025, read 11 October 2026",
  },
  "qld-fees": {
    n: 14,
    label: "Queensland Government, Property management fees and charges",
    href: "https://www.qld.gov.au/law/housing-and-neighbours/renting-and-owning-property/deciding-how-to-manage-your-investment-property/property-management-fees-and-charges",
    date: "29 October 2020",
  },
  "qld-poa": {
    n: 15,
    label: "Property Occupations Act 2014 (Qld), appointment of a property agent (Form 6)",
    href: "https://www.legislation.qld.gov.au/view/html/inforce/current/act-2014-022",
    date: "in force, read 30 September 2026",
  },
  "wa-cp": {
    n: 16,
    label: "Consumer Protection WA, You and your property manager (fees fully negotiable; every charge written into the authority; four inspections a year)",
    href: "https://www.consumerprotection.wa.gov.au/publications/you-and-your-property-manager",
    date: "updated 12 February 2025",
  },
  reiwa: {
    n: 17,
    label: "REIWA, Agent fees FAQ (government regulations do not fix fees; REIWA publishes no guideline)",
    href: "https://reiwa.com.au/the-wa-market/resources/faqs/agent-fees/",
    date: "read 30 September 2026",
  },
  "sa-law": {
    n: 18,
    label: "Legal Services Commission of South Australia, Law Handbook: Residential tenancies (Residential Tenancies Act 1995, section 53)",
    href: "https://www.lawhandbook.sa.gov.au/ch23s01.php",
    date: "read 30 September 2026",
  },
  "tas-cbos": {
    n: 19,
    label: "Consumer, Building and Occupational Services (Tasmania), The Rental Guide; Property Agents Board of Tasmania",
    href: "https://www.cbos.tas.gov.au/topics/resources-tools/rental-guide",
    date: "guide dated 2019, read 30 September 2026",
  },
  "act-gov": {
    n: 20,
    label: "ACT Government, Rental laws in the ACT (Residential Tenancies Act 1997; complaints about managing agents to Access Canberra)",
    href: "https://www.act.gov.au/housing-planning-and-property/renting/rental-laws-in-the-act",
    date: "21 January 2026",
  },
  "nt-ca": {
    n: 21,
    label: "NT Consumer Affairs, A guide to renting in the Northern Territory, version 4.3",
    href: "https://consumeraffairs.nt.gov.au/_resources/documents/for-consumers/residential-tenancies/guide-to-renting-in-the-nt.pdf",
    date: "February 2026",
  },
  ato: {
    n: 22,
    label: "ATO, Rental properties 2025: rental expenses (property agent's fees and commissions are an immediate deduction)",
    href: "https://www.ato.gov.au/forms-and-instructions/rental-properties-2025/rental-expenses",
    date: "June 2025",
  },
};

export interface PmPctRange {
  /** Published range, percent of rent collected. */
  low: number;
  high: number;
  /** State average, LocalAgentFinder March 2026 (the figure the AI Overview prints). */
  average: number;
  /** Where the capital differs from the state. */
  note?: string;
  sources: PmSourceKey[];
}

export interface PmWeeksRange {
  low?: number;
  high?: number;
  /** State average in weeks of rent, LocalAgentFinder March 2026. */
  average: number;
  sources: PmSourceKey[];
}

export interface PmDollarRange {
  low: number;
  high: number;
  /** "dollars" per event, or "weeks" of rent. */
  unit: "dollars" | "weeks";
  note?: string;
  sources: PmSourceKey[];
}

export interface PmStateFees {
  state: StateCode;
  name: string;
  capital: string;
  management: PmPctRange;
  letting: PmWeeksRange;
  /** null where no named source publishes a range for the state. */
  renewal: PmDollarRange | null;
  inspection: PmDollarRange | null;
  admin: PmDollarRange | null;
  /** Calculator default. Where the tenancy law caps inspections, the cap. */
  inspectionsPerYear: number;
  inspectionsNote: string;
  /** One or two sentences on what the state's law says about the fee. */
  regulated: string;
}

export const PM_STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const PM_STATE_FEES: Record<StateCode, PmStateFees> = {
  NSW: {
    state: "NSW",
    name: STATE_NAMES.NSW,
    capital: "Sydney",
    management: { low: 5, high: 8, average: 5.8, note: "Sydney; up to 12% in regional NSW", sources: ["laf", "reiq", "wra-syd"] },
    letting: { low: 1, high: 2, average: 1.1, sources: ["laf", "wra-syd"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 4,
    inspectionsNote: "NSW caps routine inspections at four in any 12 months, each with 7 days' written notice.",
    regulated:
      "No NSW law sets the fee, but under the Property and Stock Agents Act 2002 the management agency agreement must be in writing, state the fees and expenses, and reach you signed within 48 hours or the agent cannot recover commission or expenses (section 55). The Residential Tenancies Act 2010 caps routine inspections at four in any 12 months, so an inspection charge can apply at most four times a year.",
  },
  VIC: {
    state: "VIC",
    name: STATE_NAMES.VIC,
    capital: "Melbourne",
    management: { low: 5, high: 10, average: 5.9, note: "about 6% in metropolitan Melbourne, 8% to 10% in regional Victoria", sources: ["laf", "reiq", "wra-mel"] },
    letting: { low: 1, high: 4, average: 1.5, sources: ["laf", "wra-mel"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 2,
    inspectionsNote: "Victoria allows one general inspection every six months and none in the first three months of a tenancy.",
    regulated:
      "Consumer Affairs Victoria says you sign an exclusive leasing and/or managing authority, every fee and expense including GST must be written on it, a percentage management fee must also be shown as a dollar amount, and all fees are negotiable except those fixed by law. The Residential Tenancies Act 1997 allows a general inspection only once every six months and not in the first three months, so inspection charges are limited to about two a year.",
  },
  QLD: {
    state: "QLD",
    name: STATE_NAMES.QLD,
    capital: "Brisbane",
    management: { low: 7, high: 12, average: 7.5, note: "Brisbane average about 9%", sources: ["laf", "reiq", "wra-bne"] },
    letting: { low: 1, high: 2, average: 1.0, sources: ["laf", "wra-bne"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 4,
    inspectionsNote: "Most Queensland agencies inspect quarterly; the Form 6 states whether each inspection is charged.",
    regulated:
      "Queensland does not regulate the amount: the Queensland Government says fees are negotiable and should be agreed and put in writing before the agent starts. Under the Property Occupations Act 2014 the appointment is made on Form 6, which must state each service, the fee or commission inclusive of GST, when it is payable and any expenses, and an agent cannot charge for a service the form does not cover.",
  },
  WA: {
    state: "WA",
    name: STATE_NAMES.WA,
    capital: "Perth",
    management: { low: 8.5, high: 11, average: 8.7, note: "Perth; 11% or more in regional WA", sources: ["laf", "reiq", "wra-per"] },
    letting: { low: 2, high: 3, average: 1.7, sources: ["laf", "wra-per"] },
    renewal: { low: 150, high: 250, unit: "dollars", sources: ["wra-per"] },
    inspection: { low: 50, high: 100, unit: "dollars", note: "each, at most four a year", sources: ["wra-per", "wa-cp"] },
    admin: { low: 20, high: 40, unit: "dollars", note: "statement or annual summary", sources: ["wra-per"] },
    inspectionsPerYear: 4,
    inspectionsNote: "WA's Residential Tenancies Act 1987 limits routine inspections to four a year.",
    regulated:
      "No regulation fixes the fee: Consumer Protection WA says fees are fully negotiable and every charge, including advertising up to an amount you initial, must be written into the authority, and REIWA publishes no guideline and does not monitor what its members charge. The Residential Tenancies Act 1987 limits routine inspections to four a year.",
  },
  SA: {
    state: "SA",
    name: STATE_NAMES.SA,
    capital: "Adelaide",
    management: { low: 9, high: 15, average: 7.5, note: "Adelaide agencies mostly 9% to 11%", sources: ["laf", "reiq", "wra-adl"] },
    letting: { low: 2, high: 2, average: 1.9, sources: ["laf", "wra-adl"] },
    renewal: { low: 1, high: 1, unit: "weeks", note: "often one week's rent", sources: ["wra-adl"] },
    inspection: { low: 50, high: 100, unit: "dollars", note: "each", sources: ["wra-adl"] },
    admin: { low: 30, high: 100, unit: "dollars", note: "annual statement", sources: ["wra-adl"] },
    inspectionsPerYear: 4,
    inspectionsNote: "Most Adelaide agencies inspect quarterly; the agreement states whether each is charged.",
    regulated:
      "South Australian law sets no fee, but the Residential Tenancies Act 1995 bars anyone from taking a payment from a tenant other than rent and bond and makes the landlord pay for preparing the agreement (section 53), so letting, agreement and statement costs sit with the owner. Consumer and Business Services enforces the Act and licenses agents under the Land Agents Act 1994.",
  },
  TAS: {
    state: "TAS",
    name: STATE_NAMES.TAS,
    capital: "Hobart",
    management: { low: 5, high: 10, average: 8.7, note: "5% to 7% in central Hobart, 9% to 10% regional; Hobart average 8.4%", sources: ["laf", "reiq", "wra-hba"] },
    letting: { low: 1, high: 4, average: 2.0, sources: ["laf", "wra-hba"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 4,
    inspectionsNote: "Most Tasmanian agencies inspect quarterly; the agreement states whether each is charged.",
    regulated:
      "No Tasmanian law sets the fee: agents are licensed by the Property Agents Board under the Property Agents and Land Transactions Act 2016, and the Residential Tenancy Act 1997 governs the tenancy rather than your contract with the agent. Consumer, Building and Occupational Services, which administers the Act, treats an agent's re-letting fee as the owner's cost, not one that can be recovered from a departing tenant.",
  },
  ACT: {
    state: "ACT",
    name: STATE_NAMES.ACT,
    capital: "Canberra",
    management: { low: 6, high: 8, average: 7.1, note: "Canberra; higher outside it", sources: ["laf", "reiq", "wra-cbr"] },
    letting: { low: 1, high: 2, average: 1.2, sources: ["laf", "wra-cbr"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 4,
    inspectionsNote: "Most Canberra agencies inspect quarterly; the agreement states whether each is charged.",
    regulated:
      "The ACT sets no fee: agents are licensed by Access Canberra under the Agents Act 2003, which also takes complaints about a managing agent, and the Residential Tenancies Act 1997 governs the tenancy itself. Put every charge in the management agreement before you sign.",
  },
  NT: {
    state: "NT",
    name: STATE_NAMES.NT,
    capital: "Darwin",
    management: { low: 5, high: 10, average: 8.5, sources: ["laf", "reiq"] },
    letting: { average: 1.0, sources: ["laf"] },
    renewal: null,
    inspection: null,
    admin: null,
    inspectionsPerYear: 4,
    inspectionsNote: "Most Darwin agencies inspect quarterly; the agreement states whether each is charged.",
    regulated:
      "The Territory sets no fee. Agents are licensed under the Agents Licensing Act 1979 and the Residential Tenancies Act 1999 governs the tenancy; NT Consumer Affairs' renting guide says a landlord is responsible for the actions of the agent they appoint, so read the agreement before you sign it.",
  },
};

const pct = (n: number) => `${n}%`;
const weeks = (n: number) => (n === 1 ? "1 week" : `${n} weeks`);
/** "1 week's rent", "1.4 weeks' rent", "1 to 2 weeks' rent". */
const weeksRent = (n: number) => (n === 1 ? "1 week's rent" : `${n} weeks' rent`);
const dollars = (n: number) => `$${n.toLocaleString("en-AU")}`;

export interface PmCell {
  text: string;
  /** Footnote numbers, ascending. */
  refs: number[];
}

const refs = (keys: PmSourceKey[]): number[] =>
  [...new Set(keys.map((k) => PM_FEE_SOURCES[k].n))].sort((a, b) => a - b);

export function noPublishedRange(state: StateCode): string {
  return `No published ${state} range`;
}

export function managementCell(s: PmStateFees): PmCell {
  const m = s.management;
  const range = m.low === m.high ? pct(m.low) : `${pct(m.low)} to ${pct(m.high)}`;
  const note = m.note ? ` (${m.note})` : "";
  return { text: `${range}${note}; state average ${pct(m.average)}`, refs: refs(m.sources) };
}

export function lettingCell(s: PmStateFees): PmCell {
  const l = s.letting;
  if (l.low === undefined || l.high === undefined) {
    return { text: `about ${weeks(l.average)} (state average)`, refs: refs(l.sources) };
  }
  const range = l.low === l.high ? weeks(l.low) : `${l.low} to ${weeks(l.high)}`;
  return { text: `${range}; state average ${weeks(l.average)}`, refs: refs(l.sources) };
}

export function dollarCell(state: StateCode, r: PmDollarRange | null): PmCell {
  if (!r) return { text: noPublishedRange(state), refs: [] };
  const fmt = r.unit === "weeks" ? (n: number) => (n === 1 ? "1 week's rent" : `${n} weeks' rent`) : dollars;
  const range = r.low === r.high ? fmt(r.low) : `${fmt(r.low)} to ${fmt(r.high)}`;
  const note = r.note ? ` (${r.note})` : "";
  return { text: `${range}${note}`, refs: refs(r.sources) };
}

/**
 * The per-state answer under "How much are property management fees in
 * {state}?": the published range and average, the letting fee, then what
 * the state's law says. Two to four sentences, every figure sourced.
 */
export function stateFeeAnswer(state: StateCode): string {
  const s = PM_STATE_FEES[state];
  const m = s.management;
  const l = s.letting;
  const rangeSources = m.sources
    .filter((k) => k !== "laf")
    .map((k) => sourceShortName(k))
    .join("; ");
  const range = m.low === m.high ? pct(m.low) : `${pct(m.low)} to ${pct(m.high)}`;
  const detail = m.note ? `${m.note}; ${rangeSources}` : rangeSources;
  const first = `In ${s.name}, the published management fee is ${range} of rent collected (${detail}), and LocalAgentFinder's March 2026 state average is ${pct(m.average)}.`;
  const letting =
    l.low === undefined || l.high === undefined
      ? `The letting fee averages ${weeksRent(l.average)} (LocalAgentFinder, March 2026).`
      : `Letting fees run ${l.low === l.high ? weeksRent(l.low) : `${l.low} to ${weeksRent(l.high)}`} when a new tenant is signed, averaging ${weeks(l.average)}.`;
  return `${first} ${letting} ${s.regulated}`;
}

export function sourceShortName(k: PmSourceKey): string {
  switch (k) {
    case "laf": return "LocalAgentFinder, March 2026";
    case "reiq": return "REIQ, December 2023";
    case "wra-syd": return "WhichRealEstateAgent Sydney, March 2026";
    case "wra-mel": return "WhichRealEstateAgent Melbourne, 2026";
    case "wra-bne": return "WhichRealEstateAgent Brisbane, 2026";
    case "wra-per": return "WhichRealEstateAgent Perth, 2026";
    case "wra-adl": return "WhichRealEstateAgent Adelaide, March 2026";
    case "wra-hba": return "WhichRealEstateAgent Hobart, 2026";
    case "wra-cbr": return "WhichRealEstateAgent Canberra, 2026";
    default: return PM_FEE_SOURCES[k].label;
  }
}

/** Sources in footnote order for the list under the table and the Sources block. */
export const PM_FEE_SOURCE_LIST: PmSource[] = (Object.keys(PM_FEE_SOURCES) as PmSourceKey[])
  .map((k) => PM_FEE_SOURCES[k])
  .sort((a, b) => a.n - b.n);

/** National figures the FAQ quotes, from the same source as the state averages. */
export const PM_NATIONAL = { managementAverage: 7.5, lettingAverageWeeks: 1.4, source: "laf" as PmSourceKey };

export interface PmFaq {
  question: string;
  answer: string;
}

/**
 * The FAQ on the page and in its FAQPage JSON-LD. The first three are the
 * People-also-ask questions on the "property management fees" SERP
 * (serp-summary.csv, 30 Sep 2026); each answer is 40+ words with a figure
 * and a named, dated source.
 */
export const PM_FEES_FAQS: PmFaq[] = [
  {
    question: "What percentage do most property management companies charge?",
    answer:
      "Most Australian agencies charge between 5% and 12% of the rent they collect, and the national average is about 7.5% (LocalAgentFinder, March 2026). The state averages run from 5.8% in New South Wales and 5.9% in Victoria to 7.1% in the ACT, 7.5% in Queensland and South Australia, 8.5% in the Northern Territory and 8.7% in Western Australia and Tasmania. Regional areas sit at the top of each state's range, and a quote may or may not include GST, so ask.",
  },
  {
    question: "What is the typical property management fee in Western Australia?",
    answer:
      "Western Australia is the dearest state for management: 8.5% to 11% of rent in Perth and 11% or more in regional WA (REIQ, December 2023; WhichRealEstateAgent, Perth, 2026), with a state average of 8.7% (LocalAgentFinder, March 2026). The letting fee is also higher than the east coast at 2 to 3 weeks' rent, and Perth agencies quote $50 to $100 a routine inspection, $150 to $250 for a lease renewal and $20 to $40 for statements. No regulation fixes any of these: Consumer Protection WA says every fee is negotiable and must be written into the authority you sign.",
  },
  {
    question: "What is a reasonable management fee?",
    answer:
      "A reasonable fee sits inside your state's published range and buys the full service: rent collection, arrears follow-up, routine inspections, maintenance coordination and tribunal work. In Sydney and Melbourne that is about 5% to 8%; in Brisbane, Adelaide, Perth and Hobart it is 7% to 11% (WhichRealEstateAgent city guides, 2026). Compare the all-in annual cost from the calculator on this page rather than the headline rate: a 6% manager who charges for every inspection, statement and renewal can cost more than an 8% manager who includes them.",
  },
  {
    question: "What is the average property management fee in Australia?",
    answer:
      "About 7.5% of weekly rent, with a letting fee averaging 1.4 weeks' rent (LocalAgentFinder, March 2026). New South Wales (5.8%) and Victoria (5.9%) are the cheapest states; Western Australia and Tasmania (8.7%) the dearest. Regional areas run higher than the capitals everywhere, up to about 12% in regional New South Wales and Queensland (REIQ, December 2023). Add the letting fee and the published extras and the all-in cost runs from about 7% of annual rent at New South Wales' figures to about 12% at Western Australia's (the calculator on this page shows each state).",
  },
  {
    question: "Is the property management fee tax deductible?",
    answer:
      "Yes. Property management fees are deductible against rental income in the year you pay them for a property that is rented or genuinely available for rent, and the same applies to letting fees, lease renewal fees, inspection charges and statement fees, because they are costs of earning the rent (ATO, Rental properties 2025: rental expenses, June 2025). Keep the agency's end-of-financial-year statement: it lists every fee for the return.",
  },
  {
    question: "Can I negotiate the property management fee?",
    answer:
      "Yes. No state fixes the fee: Consumer Affairs Victoria (April 2025) and Consumer Protection WA (February 2025) both say every fee is negotiable, and REIWA publishes no guideline. Agencies move most on the headline rate for higher rents and multi-property portfolios, and most often drop the small charges (statement, admin and routine inspection fees) on request. Get three written fee schedules and compare the annual total, not the percentage.",
  },
  {
    question: "What is a letting fee?",
    answer:
      "A one-off charge when the agency finds and signs a new tenant, covering advertising, applicant screening, the tenancy agreement and the ingoing condition report. It is usually 1 to 2 weeks' rent, 2 to 3 weeks in Perth and up to 4 weeks in some Melbourne and Hobart agencies (WhichRealEstateAgent, 2026); the national average is 1.4 weeks (LocalAgentFinder, March 2026). You pay it each time the tenant changes, so a property that turns over every year pays twice what one on a two-year tenancy does.",
  },
  {
    question: "How often should I get routine inspections?",
    answer:
      "Quarterly is the usual rhythm and the legal ceiling in two states: New South Wales and Western Australia cap routine inspections at four in any 12 months (NSW Government; Consumer Protection WA), while Victoria allows one general inspection every six months and none in the first three months (Consumer Affairs Victoria). Where agencies publish a charge it is $50 to $100 an inspection (WhichRealEstateAgent, Perth and Adelaide, 2026); many include two or four a year in the management fee, so ask.",
  },
  {
    question: "Can I switch property managers mid-tenancy?",
    answer:
      "Yes. The management agreement sets the notice period, usually 30 to 60 days, and in Queensland the Form 6 appointment states its term and how it ends (Property Occupations Act 2014). You give written notice, the outgoing agency hands over keys, files, the bond record and any rent in trust, and the tenancy continues unchanged. Check the agreement for an exit fee before you sign it; that is the clause to strike out.",
  },
];
