// The arithmetic behind /cgt-calculator. Pure, so the widget, the page's
// worked figures and the tests share one engine.
//
// Until 10 Oct 2026 the widget asked for a marginal rate from the retired
// 2023-24 scale (19%, 32.5%, 37%, 45%), halved the gain for companies (which
// get no discount), missed a sale at exactly 12 months, and left out the
// Medicare levy. It now taxes the gain at the ATO's resident rates for the
// year of the sale contract on top of the owner's other taxable income, adds
// the 2% Medicare levy, applies the discount each kind of owner gets, and
// works out the 12 months from the contract dates as the ATO does.
//
// From 1 July 2027 (Treasury Laws Amendment (Tax Reform No. 1) Act 2026) the
// 50% discount gives way, for gains that accrue from that date, to cost base
// indexation and a 30% minimum tax for resident individuals. For an asset
// owned before then and sold after, the gain is split at 1 July 2027: the part
// up to that date keeps the discount, the part after it is indexed from the
// asset's value on that date. Companies and super funds are outside the change.
// The Budget explainer's cameos (Jane, David, Jack) are test cases.

import { MEDICARE_LEVY_PCT } from "@/lib/utils/income-tax";

export const CGT_DISCOUNT_SOURCE = {
  name: "ATO, CGT discount",
  url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount",
  dated: "last updated 29 June 2026",
  readOn: "11 October 2026",
} as const;

export const COMPANY_RATE_SOURCE = {
  name: "ATO, Changes to company tax rates",
  url: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rate-changes",
  dated: "last updated 4 September 2026",
  readOn: "11 October 2026",
} as const;

export const SMSF_TAX_SOURCE = {
  name: "ATO, How SMSFs are taxed",
  url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-administration-and-reporting/how-smsfs-are-taxed",
  dated: "last updated 2 April 2025",
  readOn: "11 October 2026",
} as const;

export const TAX_CUTS_2027_SOURCE = {
  name: "ATO, Personal income tax: new tax cuts for every Australian taxpayer",
  url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer",
  dated: "last updated 13 May 2026",
  readOn: "11 October 2026",
} as const;

/** The 1 July 2027 start of the CGT change (Tax Reform No. 1 Act). */
export const REFORM_START_ISO = "2027-07-01";
/** The 30% minimum tax on capital gains accruing from 1 July 2027 (Division 119). */
export const MINIMUM_TAX_PCT = 30;
/** The Budget explainer's inflation assumption in its cameos (12 May 2026). */
export const DEFAULT_INFLATION_PCT = 2.5;

type Brackets = readonly { over: number; rate: number }[];

/**
 * Resident rates by income year (ATO, Tax rates for Australian residents,
 * last updated 13 August 2026, for 2025-26 and 2026-27; for 2027-28 the
 * legislated cut of the 15% rate to 14% from 1 July 2027, ATO, last updated
 * 13 May 2026, with the thresholds unchanged). A sale contract after 30 June
 * 2028 is taxed at the 2027-28 rates, the latest legislated.
 */
export const RESIDENT_RATES: readonly { year: string; from: string; brackets: Brackets }[] = [
  { year: "2025–26", from: "2025-07-01", brackets: [{ over: 0, rate: 0 }, { over: 18_200, rate: 16 }, { over: 45_000, rate: 30 }, { over: 135_000, rate: 37 }, { over: 190_000, rate: 45 }] },
  { year: "2026–27", from: "2026-07-01", brackets: [{ over: 0, rate: 0 }, { over: 18_200, rate: 15 }, { over: 45_000, rate: 30 }, { over: 135_000, rate: 37 }, { over: 190_000, rate: 45 }] },
  { year: "2027–28", from: "2027-07-01", brackets: [{ over: 0, rate: 0 }, { over: 18_200, rate: 14 }, { over: 45_000, rate: 30 }, { over: 135_000, rate: 37 }, { over: 190_000, rate: 45 }] },
];

/** The rates for the income year a sale contract falls in (2025-26 for anything earlier). */
export function ratesForDate(iso: string) {
  let pick = RESIDENT_RATES[0];
  for (const r of RESIDENT_RATES) if (iso >= r.from) pick = r;
  return pick;
}

function taxAt(brackets: Brackets, taxable: number): number {
  let tax = 0;
  brackets.forEach((b, i) => {
    const top = brackets[i + 1]?.over ?? Infinity;
    if (taxable > b.over) tax += ((Math.min(taxable, top) - b.over) * b.rate) / 100;
  });
  return tax;
}

function rateOnNextDollar(brackets: Brackets, taxable: number): number {
  let rate = 0;
  for (const b of brackets) if (taxable > b.over) rate = b.rate;
  return rate;
}

/** Who sells. A trust is modelled as one adult resident beneficiary taking the whole gain. */
export type CgtOwner = "individual" | "joint" | "trust" | "company" | "smsf";

export const CGT_OWNER_LABELS: Record<CgtOwner, string> = {
  individual: "Individual",
  joint: "Joint (50/50)",
  trust: "Trust",
  company: "Company",
  smsf: "SMSF",
};

/** The discount on a gain from an asset held at least 12 months (ATO, CGT discount). */
export const CGT_DISCOUNT: Record<CgtOwner, number> = {
  individual: 0.5,
  joint: 0.5,
  trust: 0.5,
  company: 0,
  smsf: 1 / 3,
};

/** Complying super funds pay 15% on income, capital gains included (ATO). */
export const SMSF_TAX_RATE = 15;
/** 25% for a base rate entity, 30% otherwise; rent and capital gains count as passive income (ATO). */
export type CompanyRate = 25 | 30;

export type MainResidenceUse = "no" | "always" | "part";

/** Which rules the sale falls under. */
export type CgtRules = "discount" | "split" | "indexation";

export interface CgtInput {
  purchasePrice: number;
  /** Stamp duty, legal costs, inspections and capital improvements. */
  purchaseCosts: number;
  salePrice: number;
  /** Agent's commission, marketing and legal costs of the sale. */
  saleCosts: number;
  /** Contract date of the purchase, YYYY-MM-DD. */
  purchaseDate: string;
  /** Contract date of the sale (the CGT event), YYYY-MM-DD. */
  saleDate: string;
  owner: CgtOwner;
  /** Each owner's taxable income for the year before the gain (individuals, joint owners, the trust's beneficiary). */
  otherIncome: number;
  companyRate: CompanyRate;
  /** Whether the property was the owner's main residence (individuals, joint owners only). */
  mainResidence: MainResidenceUse;
  /** Days it was the main residence, when mainResidence is "part". */
  mainResidenceDays: number;
  /** The asset's value at 1 July 2027, for an asset owned then and sold after. Null: the apportioning estimate. */
  valueAt2027?: number | null;
  /** Annual inflation assumed for indexation, %. */
  inflationPct?: number;
  /** Receives the Age Pension, JobSeeker or another payment listed in s 119-15 in the year of sale. */
  exemptPayment?: boolean;
  /** A new residential dwelling bought by its first owner: the choice of the 50% discount or indexation. */
  newBuild?: boolean;
}

export interface CgtResult {
  costBase: number;
  proceeds: number;
  /** Proceeds less cost base; negative is a capital loss. */
  grossGain: number;
  daysOwned: number;
  heldAtLeast12Months: boolean;
  /** Share of the gain exempt as a main residence, 0 to 1. */
  exemptShare: number;
  /** The gain after the main residence exemption. */
  assessableGain: number;
  /** The rules applied, after any new build choice. */
  rules: CgtRules;
  /** The discount applied to the gain (or the part up to 1 July 2027), 0 to 1. */
  discount: number;
  /** Split and indexation sales: the value used at 1 July 2027 and whether it was estimated. */
  valueAt2027: number | null;
  valueAt2027Estimated: boolean;
  /** The nominal gain up to 1 July 2027 (split sales), after the main residence exemption. */
  gainBefore2027: number;
  /** The gain from 1 July 2027 (or the purchase, if later) after indexation, after the main residence exemption. */
  indexedGainAfter2027: number;
  /** The cost base indexed to the sale date (indexation sales) or the 1 July 2027 value indexed (split sales). */
  indexedBase: number;
  /** For a new build: the rules the first owner would choose, and the tax under the other option. */
  newBuildChoice: { chosen: CgtRules; alternativeTax: number } | null;
  /** The gain added to taxable income, after discount or indexation (all owners). */
  taxableGain: number;
  owners: number;
  /** Each owner's share of the taxable gain. */
  taxableGainPerOwner: number;
  /** The income year of the sale contract and the rate on the owner's next dollar before the gain. */
  taxYear: string;
  marginalRateBefore: number;
  incomeTax: number;
  /** Extra tax to bring the post-2027 gain up to the 30% minimum (all owners). */
  minimumTaxTopUp: number;
  medicareLevy: number;
  totalTax: number;
  /** Total tax as a share of the gross gain, %. */
  effectiveRate: number;
  netProfit: number;
}

const pos = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);
const round = (n: number) => Math.round(n) + 0;

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null;
}

const utc = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);

/** Days from one ISO date to another (0 when either is invalid or the order is wrong). */
export function daysBetween(fromIso: string, toIso: string): number {
  const a = parseIso(fromIso);
  const b = parseIso(toIso);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((utc(b.y, b.m, b.d) - utc(a.y, a.m, a.d)) / 86_400_000));
}

/** Whole and part years between two dates, for indexation and the apportioning estimate. */
function yearsBetween(fromIso: string, toIso: string): number {
  return daysBetween(fromIso, toIso) / 365.25;
}

/** Whole years when the dates fall on the same day of the year, so a cameo's "five years" is exactly 5. */
function indexYears(fromIso: string, toIso: string): number {
  const a = parseIso(fromIso);
  const b = parseIso(toIso);
  if (a && b && a.m === b.m && a.d === b.d) return Math.max(0, b.y - a.y);
  return yearsBetween(fromIso, toIso);
}

/**
 * The ATO's 12-month test: you must own the asset for at least 12 months
 * before the CGT event, leaving out the day you acquired it and the day of the
 * event. Its example: acquired 2 February 2021, discount on a CGT event on or
 * after 3 February 2022. So the sale contract must fall after the same date a
 * year on (the end of the month where that day does not exist).
 */
export function heldAtLeast12Months(purchaseIso: string, saleIso: string): boolean {
  const a = parseIso(purchaseIso);
  const b = parseIso(saleIso);
  if (!a || !b) return false;
  const lastDay = new Date(Date.UTC(a.y + 1, a.m, 0)).getUTCDate();
  const anniversary = utc(a.y + 1, a.m, Math.min(a.d, lastDay));
  return utc(b.y, b.m, b.d) > anniversary;
}

/**
 * The value at 1 July 2027 by the apportioning approach the Budget explainer
 * describes (a formula "based on its growth rate over the asset's holding
 * period"): constant growth from the purchase price to the sale price. Its
 * Jane cameo (bought $800,000 in July 2022, sold $1,600,000 in July 2032,
 * worth $1,131,371 on 1 July 2027) is exactly this. The ATO's tool will set
 * the real method.
 */
export function apportionedValueAt2027(purchasePrice: number, salePrice: number, purchaseIso: string, saleIso: string): number {
  const total = indexYears(purchaseIso, saleIso);
  const before = indexYears(purchaseIso, REFORM_START_ISO);
  if (total <= 0 || purchasePrice <= 0 || salePrice <= 0) return purchasePrice;
  return purchasePrice * Math.pow(salePrice / purchasePrice, before / total);
}

interface Tax { incomeTax: number; topUp: number; medicare: number; marginal: number; year: string }

/**
 * Tax on one owner's taxable gain on top of their other income, at the rates
 * for the year of sale. `postGain` is the part that accrued from 1 July 2027;
 * it is taken as the top slice of income when testing it against the 30%
 * minimum (the Budget explainer's Jack cameo works this way), before offsets
 * and without the Medicare levy.
 */
function personalTax(other: number, preGain: number, postGain: number, saleIso: string, minimum: boolean): Tax {
  const r = ratesForDate(saleIso);
  const base = pos(other);
  const all = taxAt(r.brackets, base + preGain + postGain) - taxAt(r.brackets, base);
  const onPost = taxAt(r.brackets, base + preGain + postGain) - taxAt(r.brackets, base + preGain);
  const topUp = minimum && postGain > 0 ? Math.max(0, (postGain * MINIMUM_TAX_PCT) / 100 - onPost) : 0;
  return {
    incomeTax: all,
    topUp,
    medicare: ((preGain + postGain) * MEDICARE_LEVY_PCT) / 100,
    marginal: rateOnNextDollar(r.brackets, base),
    year: r.year,
  };
}

interface Taxable { rules: CgtRules; discount: number; pre: number; post: number; gainBefore2027: number; indexedGainAfter2027: number; indexedBase: number; value2027: number | null; estimated: boolean }

/** The taxable gain under the rules for the owner and the sale date, before the main residence exemption share is applied. */
function taxableParts(i: CgtInput, costBase: number, proceeds: number, held: boolean, forceDiscount: boolean): Taxable {
  const reformed = (i.owner === "individual" || i.owner === "joint" || i.owner === "trust") && !forceDiscount;
  const inflation = (i.inflationPct ?? DEFAULT_INFLATION_PCT) / 100;
  const gross = proceeds - costBase;
  const none = { gainBefore2027: 0, indexedGainAfter2027: 0, indexedBase: 0, value2027: null, estimated: false };
  if (!reformed || i.saleDate < REFORM_START_ISO || gross <= 0) {
    const discount = held ? CGT_DISCOUNT[i.owner] : 0;
    return { rules: "discount", discount, pre: Math.max(0, gross) * (1 - discount), post: 0, ...none };
  }
  if (i.purchaseDate >= REFORM_START_ISO) {
    // Bought on or after 1 July 2027: wholly under the new rules. Indexation
    // needs 12 months of ownership; it never turns a gain into a loss.
    const indexedBase = held ? costBase * Math.pow(1 + inflation, indexYears(i.purchaseDate, i.saleDate)) : costBase;
    const post = Math.max(0, proceeds - indexedBase);
    return { rules: "indexation", discount: 0, pre: 0, post, gainBefore2027: 0, indexedGainAfter2027: post, indexedBase, value2027: null, estimated: false };
  }
  // Owned on 1 July 2027 and sold after: split the gain at that date.
  const estimated = i.valueAt2027 == null || !(i.valueAt2027 > 0);
  const value2027 = estimated ? apportionedValueAt2027(pos(i.purchasePrice), pos(i.salePrice), i.purchaseDate, i.saleDate) : pos(i.valueAt2027!);
  const gainBefore2027 = value2027 - costBase;
  const discount = held ? CGT_DISCOUNT[i.owner] : 0;
  const pre = Math.max(0, gainBefore2027) * (1 - discount);
  const indexedBase = held ? value2027 * Math.pow(1 + inflation, indexYears(REFORM_START_ISO, i.saleDate)) : value2027;
  const post = Math.max(0, proceeds - indexedBase);
  return { rules: "split", discount, pre, post, gainBefore2027, indexedGainAfter2027: post, indexedBase, value2027, estimated };
}

export function computeCgt(i: CgtInput): CgtResult {
  const costBase = round(pos(i.purchasePrice) + pos(i.purchaseCosts));
  const proceeds = round(pos(i.salePrice) - pos(i.saleCosts));
  const grossGain = proceeds - costBase;
  const daysOwned = daysBetween(i.purchaseDate, i.saleDate);
  const held = heldAtLeast12Months(i.purchaseDate, i.saleDate);

  const personal = i.owner === "individual" || i.owner === "joint";
  let exemptShare = 0;
  if (personal && i.mainResidence === "always") exemptShare = 1;
  else if (personal && i.mainResidence === "part" && daysOwned > 0) {
    exemptShare = Math.min(1, pos(i.mainResidenceDays) / daysOwned);
  }
  const keep = 1 - exemptShare;
  const owners = i.owner === "joint" ? 2 : 1;
  const taxedAsPerson = personal || i.owner === "trust";

  const run = (forceDiscount: boolean) => {
    const parts = taxableParts(i, costBase, proceeds, held, forceDiscount);
    const pre = (parts.pre * keep) / owners;
    const post = (parts.post * keep) / owners;
    let incomeTaxTotal = 0;
    let topUp = 0;
    let medicare = 0;
    let marginal = 0;
    let year = ratesForDate(i.saleDate).year;
    if (i.owner === "company") incomeTaxTotal = ((parts.pre + parts.post) * keep * i.companyRate) / 100;
    else if (i.owner === "smsf") incomeTaxTotal = ((parts.pre + parts.post) * keep * SMSF_TAX_RATE) / 100;
    else {
      const t = personalTax(i.otherIncome, pre, post, i.saleDate, !i.exemptPayment);
      incomeTaxTotal = t.incomeTax * owners;
      topUp = t.topUp * owners;
      medicare = t.medicare * owners;
      marginal = t.marginal;
      year = t.year;
    }
    return { parts, pre, post, incomeTaxTotal, topUp, medicare, marginal, year, total: incomeTaxTotal + topUp + medicare };
  };

  let chosen = run(false);
  let newBuildChoice: CgtResult["newBuildChoice"] = null;
  if (i.newBuild && taxedAsPerson && chosen.parts.rules !== "discount") {
    const withDiscount = run(true);
    if (withDiscount.total < chosen.total) {
      newBuildChoice = { chosen: "discount", alternativeTax: round(chosen.total) };
      chosen = withDiscount;
    } else {
      newBuildChoice = { chosen: chosen.parts.rules, alternativeTax: round(withDiscount.total) };
    }
  }

  const { parts } = chosen;
  const taxableGain = (parts.pre + parts.post) * keep;
  const totalTax = round(chosen.total);
  return {
    costBase,
    proceeds,
    grossGain,
    daysOwned,
    heldAtLeast12Months: held,
    exemptShare,
    assessableGain: round(Math.max(0, grossGain) * keep),
    rules: parts.rules,
    discount: parts.discount,
    valueAt2027: parts.value2027 === null ? null : round(parts.value2027),
    valueAt2027Estimated: parts.estimated,
    gainBefore2027: round(parts.gainBefore2027 * keep),
    indexedGainAfter2027: round(parts.indexedGainAfter2027 * keep),
    indexedBase: round(parts.indexedBase),
    newBuildChoice,
    taxableGain: round(taxableGain),
    owners,
    taxableGainPerOwner: round(taxableGain / owners),
    taxYear: chosen.year,
    marginalRateBefore: taxedAsPerson ? chosen.marginal || rateOnNextDollar(ratesForDate(i.saleDate).brackets, pos(i.otherIncome)) : 0,
    incomeTax: round(chosen.incomeTaxTotal),
    minimumTaxTopUp: round(chosen.topUp),
    medicareLevy: round(chosen.medicare),
    totalTax,
    effectiveRate: grossGain > 0 ? Math.round((totalTax / grossGain) * 1000) / 10 : 0,
    netProfit: grossGain - totalTax,
  };
}

/** The calculator's starting figures: a $500,000 investment sold for $700,000 after five years. */
export function defaultCgtInput(): CgtInput {
  return {
    purchasePrice: 500_000,
    purchaseCosts: 0,
    salePrice: 700_000,
    saleCosts: 0,
    purchaseDate: "2021-11-01",
    saleDate: "2026-11-01",
    owner: "individual",
    otherIncome: 100_000,
    companyRate: 30,
    mainResidence: "no",
    mainResidenceDays: 0,
    valueAt2027: null,
    inflationPct: DEFAULT_INFLATION_PCT,
    exemptPayment: false,
    newBuild: false,
  };
}
