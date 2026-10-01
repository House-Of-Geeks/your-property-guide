// The landlord blocks of the rental-market sub-page (commercial intent
// review, 30 Sep 2026, section 3.1): what property managers charge in the
// suburb's state, a worked line on the suburb's published rent, and the
// landlord FAQs. Pure: every figure comes from a named, dated source below
// or from data the page already gates (the rent through its source label,
// the sales figures through publishedSales in src/lib/published-medians.ts,
// which built the Suburb object). Tested in tests/lib/rental-landlord.test.ts.
import type { FaqItem } from "@/components/guide/Faq";
import type { Suburb } from "@/types/suburb";
import type { SuburbRentalHistory } from "@/lib/services/rental-service";
import { GROWTH_SOURCES, publishesMedians } from "@/lib/published-medians";
import { grossYieldPercent, salesProvenanceFor } from "@/lib/suburb-snapshot";
import { monthYear, rentalSourceLabel } from "@/lib/rental-labels";

// ── Sources ─────────────────────────────────────────────────────────────────

export interface FeeSource {
  /** Publisher and page, as it is named on the page. */
  label: string;
  /** Date on the page, or the date it was read when it carries none. */
  date: string;
  url: string;
}

export const FEE_SOURCES = {
  laf: {
    label: "LocalAgentFinder, Property Management Fees Australia: 2026 Guide",
    date: "13 March 2026",
    url: "https://www.localagentfinder.com.au/blog/property-management-commission-fees",
  },
  reiq: {
    label: "REIQ, Property management fees: an in-depth guide",
    date: "1 December 2023",
    url: "https://www.reiq.com/articles/property-management/property-management-fees-an-in-depth-guide-to-understanding-the-costs-and-benefits",
  },
  houst: {
    label: "Houst, Property Management Fees in Australia: 2026 State Guide",
    date: "11 May 2026",
    url: "https://www.houst.com/blog/rental-property-management-fees",
  },
  landlordWise: {
    label: "Landlord Wise, Property Management Fees Perth",
    date: "updated 25 May 2026",
    url: "https://landlordwise.com.au/guides/property-management-fees-perth/",
  },
  nswGov: {
    label: "NSW Government, Managing a rental property",
    date: "read 30 September 2026",
    url: "https://www.nsw.gov.au/housing-and-construction/landlords/managing-a-rental-property",
  },
  qldGov: {
    label: "Queensland Government, Property management fees and charges",
    date: "29 October 2020",
    url: "https://www.qld.gov.au/law/housing-and-neighbours/renting-and-owning-property/deciding-how-to-manage-your-investment-property/property-management-fees-and-charges",
  },
  reiwa: {
    label: "REIWA, Agent fees",
    date: "read 30 September 2026",
    url: "https://reiwa.com.au/the-wa-market/resources/faqs/agent-fees/",
  },
} as const satisfies Record<string, FeeSource>;

// ── The state table ─────────────────────────────────────────────────────────

/** A percentage range; `hi` null means "and above". */
export interface PctRange {
  lo: number;
  hi: number | null;
}

export interface StateFeeRow {
  state: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
  name: string;
  /** Typical management fee, % of rent collected (FEE_SOURCES.laf). */
  managementPct: number;
  /** Metro and regional ranges (FEE_SOURCES.reiq). */
  metro: PctRange;
  regional: PctRange;
  /** Typical letting fee in weeks of rent (FEE_SOURCES.laf). */
  lettingWeeks: number;
}

export const STATE_FEES: readonly StateFeeRow[] = [
  { state: "NSW", name: "New South Wales", managementPct: 5.8, metro: { lo: 5, hi: 8 }, regional: { lo: 5, hi: 12 }, lettingWeeks: 1.1 },
  { state: "VIC", name: "Victoria", managementPct: 5.9, metro: { lo: 5, hi: 10 }, regional: { lo: 6, hi: 6 }, lettingWeeks: 1.5 },
  { state: "QLD", name: "Queensland", managementPct: 7.5, metro: { lo: 9, hi: 9 }, regional: { lo: 7, hi: 12 }, lettingWeeks: 1 },
  { state: "WA", name: "Western Australia", managementPct: 8.7, metro: { lo: 8.5, hi: 11 }, regional: { lo: 11, hi: null }, lettingWeeks: 1.7 },
  { state: "SA", name: "South Australia", managementPct: 7.5, metro: { lo: 9, hi: 15 }, regional: { lo: 9, hi: 11 }, lettingWeeks: 1.9 },
  { state: "TAS", name: "Tasmania", managementPct: 8.7, metro: { lo: 5, hi: 10 }, regional: { lo: 5, hi: 10 }, lettingWeeks: 2 },
  { state: "ACT", name: "Australian Capital Territory", managementPct: 7.1, metro: { lo: 6, hi: 8 }, regional: { lo: 8, hi: null }, lettingWeeks: 1.2 },
  { state: "NT", name: "Northern Territory", managementPct: 8.5, metro: { lo: 5, hi: 10 }, regional: { lo: 5, hi: 10 }, lettingWeeks: 1 },
];

/** National figures for copy that names no state (FEE_SOURCES.laf). */
export const NATIONAL_FEES = { managementPct: 7.5, lettingWeeks: 1.4 } as const;

export function stateFeeRow(state: string | null | undefined): StateFeeRow | null {
  const key = (state ?? "").trim().toUpperCase();
  return STATE_FEES.find((r) => r.state === key) ?? null;
}

/** Fees charged on top of the two headline ones, with the source that reports each. */
export interface AncillaryFee {
  label: string;
  range: string;
  source: FeeSource;
  /** Only shown for this state when set. */
  state?: StateFeeRow["state"];
}

export const ANCILLARY_FEES: readonly AncillaryFee[] = [
  { label: "Lease renewal", range: "$100 to $300", source: FEE_SOURCES.houst },
  { label: "Routine inspection", range: "$50 to $150 each", source: FEE_SOURCES.houst },
  { label: "Annual statement", range: "$50 to $100", source: FEE_SOURCES.houst },
  { label: "Advertising", range: "$100 to $500 a campaign", source: FEE_SOURCES.houst },
  { label: "Property condition report (Perth)", range: "$150 to $400", source: FEE_SOURCES.landlordWise, state: "WA" },
];

export function ancillaryFeesFor(state: string | null | undefined): AncillaryFee[] {
  const key = (state ?? "").trim().toUpperCase();
  return ANCILLARY_FEES.filter((f) => !f.state || f.state === key);
}

// ── Formatting ──────────────────────────────────────────────────────────────

const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

export function formatPct(n: number): string {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
}

export function formatPctRange(r: PctRange): string {
  if (r.hi === null) return `${formatPct(r.lo)} and above`;
  if (r.hi === r.lo) return formatPct(r.lo);
  return `${formatPct(r.lo)} to ${formatPct(r.hi)}`;
}

/** "1 week's rent", "1.5 weeks' rent", "2 weeks' rent". */
export function formatWeeksOfRent(weeks: number): string {
  if (weeks === 1) return "1 week's rent";
  return `${Number.isInteger(weeks) ? weeks : weeks.toFixed(1)} weeks' rent`;
}

// ── Fee maths ───────────────────────────────────────────────────────────────

/** A year of management fees on a weekly rent; null unless both inputs are positive. */
export function annualManagementFee(weeklyRent: number, pct: number): number | null {
  if (!(weeklyRent > 0) || !(pct > 0)) return null;
  return Math.round((weeklyRent * 52 * pct) / 100);
}

/** A letting fee of so many weeks of rent; null unless both inputs are positive. */
export function lettingFeeDollars(weeklyRent: number, weeks: number): number | null {
  if (!(weeklyRent > 0) || !(weeks > 0)) return null;
  return Math.round(weeklyRent * weeks);
}

// ── The suburb's published rent ─────────────────────────────────────────────

export interface PublishedRent {
  /** Median weekly house rent. */
  house: number;
  /** Source label with its postcode where the feed is postcode-level. */
  label: string;
  /** "June 2026". */
  when: string;
  source: string;
}

/**
 * The latest house median whose source the site can name. A row from a feed
 * with no label (rentalSourceLabel returns null) is not printed here, the
 * same rule the snapshot band applies to rent.
 */
export function publishedHouseRent(history: readonly SuburbRentalHistory[], postcode: string | null | undefined): PublishedRent | null {
  const rows = [...history].sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
  for (const r of rows) {
    if (!(typeof r.medianRentHouse === "number" && r.medianRentHouse > 0)) continue;
    const label = rentalSourceLabel(r.source, postcode);
    if (!label) continue;
    return { house: r.medianRentHouse, label, when: monthYear(r.periodDate), source: r.source };
  }
  return null;
}

// ── Copy ────────────────────────────────────────────────────────────────────

/** "At Werribee's median house rent of $460 a week ..., a 5.9% management fee is about $1,411 a year, and a letting fee ... about $690 ..." */
export function workedFeeLine(name: string, rent: PublishedRent, fees: StateFeeRow): string | null {
  const annual = annualManagementFee(rent.house, fees.managementPct);
  const letting = lettingFeeDollars(rent.house, fees.lettingWeeks);
  if (annual === null || letting === null) return null;
  return (
    `At ${name}'s median house rent of ${money(rent.house)} a week (${rent.label}, ${rent.when}), ` +
    `a ${formatPct(fees.managementPct)} management fee is about ${money(annual)} a year, ` +
    `and a letting fee of ${formatWeeksOfRent(fees.lettingWeeks)} is about ${money(letting)} each time a new tenant signs.`
  );
}

const signedChange = (g: number) => `${g > 0 ? "rose" : "fell"} ${Math.abs(g)}%`;

export interface InvestmentInputs {
  /** Gross house yield to one decimal, from the published rent and median; null when either is withheld. */
  yieldHouse: number | null;
  /** Published 12-month change in the house median; null when the feed does not measure it or it is withheld. */
  growthHouse: number | null;
  rent: PublishedRent | null;
  /** Published median house price; 0 when withheld. */
  medianHousePrice: number;
  /** Caption for the median, e.g. "Median of 35 house sales · NSW Valuer General · calendar 2025". */
  salesShort: string | null;
  /** Feed that measured the change, e.g. "NSW Valuer General". */
  growthSource: string | null;
}

/**
 * "Is {suburb} a good rental investment?" from the published yield and the
 * published 12-month change only. Null when neither is published: the page
 * then asks no question it cannot answer with a figure.
 */
export function investmentFaq(name: string, i: InvestmentInputs): FaqItem | null {
  const hasYield = i.yieldHouse !== null && i.rent !== null && i.medianHousePrice > 0;
  const hasGrowth = i.growthHouse !== null && i.growthHouse !== 0 && i.medianHousePrice > 0;
  if (!hasYield && !hasGrowth) return null;

  const price = `${money(i.medianHousePrice)}${i.salesShort ? ` (${i.salesShort})` : ""}`;
  const parts: string[] = [];
  if (hasYield) {
    const r = i.rent as PublishedRent;
    parts.push(
      `houses return a gross yield of about ${i.yieldHouse}%, from a median rent of ${money(r.house)} a week (${r.label}, ${r.when}) against a median house price of ${price}`,
    );
  }
  if (hasGrowth) {
    const g = i.growthHouse as number;
    parts.push(
      hasYield
        ? `the median house price ${signedChange(g)} over 12 months${i.growthSource ? ` (${i.growthSource})` : ""}`
        : `the median house price ${signedChange(g)} over 12 months, to ${price}${i.growthSource ? ` (${i.growthSource})` : ""}`,
    );
  }
  const figures = `The published figures for ${name}: ${parts.join(", and ")}.`;
  const caveat = hasYield
    ? " Gross yield is before management fees, rates, insurance, maintenance and vacancy, so the net return is lower; the fee table on this page shows what management alone takes."
    : ` No rental median is published for ${name} yet, so a gross yield cannot be worked out here.`;
  const close = ` Whether that makes ${name} a good investment depends on your loan rate, your tax position and how long you hold, so compare it with the suburbs around it and take advice on your own numbers.`;
  return { question: `Is ${name} a good rental investment?`, answer: figures + caveat + close };
}

/** The two People Also Ask questions on "rental appraisal {suburb}" searches. */
export function rentalAppraisalFaqs(name: string, rent: PublishedRent | null): FaqItem[] {
  const median = rent
    ? ` In ${name} the median house rent is ${money(rent.house)} a week (${rent.label}, ${rent.when}), which is the middle of the market rather than a quote for your property.`
    : "";
  return [
    {
      question: "Does it cost money to get a rental appraisal?",
      answer:
        "No. A rental appraisal from a property manager is free: the agency provides it in the hope of winning the management of your property, and you are under no obligation to appoint them. It is different from a valuation by a licensed valuer, which is a paid written report used by lenders and courts. The request form on this page goes to one local property manager, who pays us for the introduction; you pay nothing.",
    },
    {
      question: "What is involved in a rental appraisal?",
      answer:
        `A property manager looks at the property, in person or from photos and a description, and compares it with similar properties recently let nearby: the same suburb, dwelling type and bedroom count. They give you a rent range, usually as a weekly figure, and explain what moves it, such as condition, parking, air conditioning and whether pets are allowed.${median} The appraisal comes in writing, and you can ask for the agency's fee schedule with it so you can compare it with the table on this page.`,
    },
  ];
}

/** "What do property managers charge in {suburb}?" from the state row and the worked line. */
export function chargesFaq(name: string, fees: StateFeeRow, worked: string | null): FaqItem {
  return {
    question: `What do property managers charge in ${name}?`,
    answer:
      `In ${fees.name} the typical management fee is about ${formatPct(fees.managementPct)} of the rent collected, and the letting fee about ${formatWeeksOfRent(fees.lettingWeeks)} each time a new tenant signs (${FEE_SOURCES.laf.label}, ${FEE_SOURCES.laf.date}). ` +
      `REIQ's guide (${FEE_SOURCES.reiq.date}) puts the ${fees.state} range at ${formatPctRange(fees.metro)} in metro areas and ${formatPctRange(fees.regional)} in regional areas.` +
      (worked ? ` ${worked}` : "") +
      ` Fees are not fixed by law: the NSW Government says the fees and conditions of a management agency agreement are negotiable, and REIWA publishes no guideline fees. Ask for the full schedule, including lease renewals, inspections and statements, before you sign.`,
  };
}

// ── The model ───────────────────────────────────────────────────────────────

export interface LandlordModel {
  rent: PublishedRent | null;
  fees: StateFeeRow | null;
  ancillary: AncillaryFee[];
  workedLine: string | null;
  yieldHouse: number | null;
  growthHouse: number | null;
  faqs: FaqItem[];
}

/**
 * Everything the landlord blocks print. The Suburb object's sales figures
 * were built by publishedSales; the same rule is re-read here from the
 * freshness record so a caller cannot hand in a raw row by mistake.
 */
export function buildLandlordModel(suburb: Suburb, history: readonly SuburbRentalHistory[]): LandlordModel {
  const f = suburb.dataFreshness;
  const salesPublished = publishesMedians({ statsSource: f?.salesSource ?? null, salesCountHouse: f?.salesCount ?? null });
  const medianHousePrice = salesPublished && suburb.stats.medianHousePrice > 0 ? suburb.stats.medianHousePrice : 0;
  // A 12-month change only from a feed that measures one (publishedGrowth
  // applied the same test when the object was built).
  const measured = GROWTH_SOURCES.includes(f?.salesSource ?? "");
  const growthRaw = salesPublished && measured && medianHousePrice > 0 ? suburb.stats.annualGrowthHouse : 0;
  const growthHouse = typeof growthRaw === "number" && growthRaw !== 0 ? growthRaw : null;

  const rent = publishedHouseRent(history, suburb.postcode);
  const y = rent && medianHousePrice > 0 ? grossYieldPercent(rent.house, medianHousePrice) : null;
  const yieldHouse = y === null ? null : Math.round(y * 10) / 10;

  const fees = stateFeeRow(suburb.state);
  const workedLine = rent && fees ? workedFeeLine(suburb.name, rent, fees) : null;
  const provenance = medianHousePrice > 0 ? salesProvenanceFor(suburb) : null;

  const faqs: FaqItem[] = [];
  const invest = investmentFaq(suburb.name, {
    yieldHouse,
    growthHouse,
    rent,
    medianHousePrice,
    salesShort: provenance?.short ?? null,
    growthSource: growthHouse !== null ? provenance?.sourceLabel ?? null : null,
  });
  if (invest) faqs.push(invest);
  if (fees) faqs.push(chargesFaq(suburb.name, fees, workedLine));
  faqs.push(...rentalAppraisalFaqs(suburb.name, rent));

  return { rent, fees, ancillary: ancillaryFeesFor(suburb.state), workedLine, yieldHouse, growthHouse, faqs };
}

/** Lead-form choices, shared with the API's zod enum and the email labels. */
export const MANAGER_TIMEFRAMES = [
  { id: "asap", label: "As soon as possible" },
  { id: "0-3-months", label: "Within 3 months" },
  { id: "3-6-months", label: "3 to 6 months" },
  { id: "researching", label: "Just comparing" },
] as const;
export type ManagerTimeframe = (typeof MANAGER_TIMEFRAMES)[number]["id"];
