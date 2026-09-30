// The arithmetic behind /lmi-calculator (commercial intent review, 30 Sep
// 2026, section 3.3). Pure, so the page's FAQ examples and result table are
// computed from the same numbers the calculator shows, and so it can be tested.
//
// Every figure below comes from a named, dated source. Nothing here is a
// guess: where no published figure exists (loans above $1 million, LVR above
// 95%), the calculator says so instead of estimating.
import type { StateCode } from "@/lib/data/commission-rates";

export interface LmiSource {
  name: string;
  url: string;
  /** What the source itself says about its date. */
  dated: string;
  /** When we read it. */
  readOn: string;
}

/**
 * The premium table. Home Loan Experts publishes it as "the premium tables
 * used by one of our lenders" for full-doc owner-occupier loans, and does not
 * say whether GST is included, so the rate is applied as published and state
 * duty is added on top. It stops at loans of $1,000,000 and LVR 95%.
 */
export const LMI_RATE_SOURCE: LmiSource = {
  name: "Home Loan Experts, LMI premium rates (a lender's full-doc table)",
  url: "https://www.homeloanexperts.com.au/lenders-mortgage-insurance/lmi-premium-rates/",
  dated: "page updated 18 May 2026",
  readOn: "30 September 2026",
};

/** Helia's own LMI fee estimator: the cross-check quoted on the page. */
export const HELIA_SOURCE: LmiSource = {
  name: "Helia, LMI fee estimator",
  url: "https://www.helia.com.au/the-hub/calculators-estimators/lmi-fee-estimator",
  dated: "estimates are premiums including GST, excluding stamp duty",
  readOn: "30 September 2026",
};

/**
 * Helia estimator readings taken on 30 Sep 2026 (owner occupied, loan term up
 * to 30 years). Quoted on the page next to the table's figure so readers see
 * how far two published sources differ for the same loan.
 */
export const HELIA_READINGS = [
  { price: 600_000, deposit: 60_000, firstHomeBuyer: false, premium: 9_862 },
  { price: 600_000, deposit: 60_000, firstHomeBuyer: true, premium: 8_856 },
  { price: 800_000, deposit: 80_000, firstHomeBuyer: false, premium: 16_706 },
  { price: 800_000, deposit: 80_000, firstHomeBuyer: true, premium: 15_028 },
] as const;

/** The same Helia estimator, same day, for an investment loan: $540,000 at 90% LVR. */
export const HELIA_INVESTOR_READING = { price: 600_000, deposit: 60_000, premium: 10_869 } as const;

export const LOAN_BANDS = [
  { max: 300_000, label: "Up to $300,000" },
  { max: 500_000, label: "$300,001 to $500,000" },
  { max: 600_000, label: "$500,001 to $600,000" },
  { max: 750_000, label: "$600,001 to $750,000" },
  { max: 1_000_000, label: "$750,001 to $1,000,000" },
] as const;

type FiveRates = readonly [number, number, number, number, number];

/** Premium as a percentage of the loan, by LVR band (upper bound inclusive) and loan band. */
export const LMI_RATES: ReadonlyArray<{ lvrMin: number; lvrMax: number; rates: FiveRates }> = [
  { lvrMin: 80, lvrMax: 81, rates: [0.475, 0.568, 0.904, 0.904, 0.913] },
  { lvrMin: 81, lvrMax: 82, rates: [0.485, 0.568, 0.904, 0.904, 0.913] },
  { lvrMin: 82, lvrMax: 83, rates: [0.596, 0.699, 0.932, 1.09, 1.109] },
  { lvrMin: 83, lvrMax: 84, rates: [0.662, 0.829, 0.96, 1.09, 1.146] },
  { lvrMin: 84, lvrMax: 85, rates: [0.727, 0.969, 1.165, 1.333, 1.407] },
  { lvrMin: 85, lvrMax: 86, rates: [0.876, 1.081, 1.258, 1.407, 1.463] },
  { lvrMin: 86, lvrMax: 87, rates: [0.932, 1.146, 1.407, 1.631, 1.733] },
  { lvrMin: 87, lvrMax: 88, rates: [1.062, 1.305, 1.463, 1.631, 1.752] },
  { lvrMin: 88, lvrMax: 89, rates: [1.295, 1.621, 1.948, 2.218, 2.395] },
  { lvrMin: 89, lvrMax: 90, rates: [1.463, 1.873, 2.18, 2.367, 2.516] },
  { lvrMin: 90, lvrMax: 91, rates: [2.013, 2.618, 3.513, 3.783, 3.82] },
  { lvrMin: 91, lvrMax: 92, rates: [2.013, 2.674, 3.569, 3.867, 3.932] },
  { lvrMin: 92, lvrMax: 93, rates: [2.33, 3.028, 3.802, 4.081, 4.156] },
  { lvrMin: 93, lvrMax: 94, rates: [2.376, 3.028, 3.802, 4.286, 4.324] },
  { lvrMin: 94, lvrMax: 95, rates: [2.609, 3.345, 3.998, 4.613, 4.603] },
];

export interface LmiDutyRule {
  /** Duty as a fraction of the premium; 0 where none is charged. */
  rate: number;
  note: string;
  source: string;
  url: string;
}

/**
 * Duty on the LMI premium by state, each from the state revenue office, read
 * 30 Sep 2026. LMI is general insurance, so the general insurance rate applies
 * unless the state exempts it.
 */
export const LMI_DUTY: Record<StateCode, LmiDutyRule> = {
  NSW: {
    rate: 0,
    note: "Exempt: an LMI policy over NSW property is exempt from insurance duty for premiums paid on or after 1 July 2017.",
    source: "Revenue NSW, insurance duty exemptions",
    url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/insurance-duty/exemptions",
  },
  VIC: {
    rate: 0.1,
    note: "10%: the non-business insurance rate. Mortgage insurance is outside the business insurance duty being phased out from 1 July 2024.",
    source: "State Revenue Office Victoria, insurance duty and abolition of duty on business insurance premiums (updated 1 July 2026)",
    url: "https://www.sro.vic.gov.au/businesses-and-organisations/insurance-duty/abolition-duty-business-insurance-premiums",
  },
  QLD: {
    rate: 0.09,
    note: "9% of the premium including GST. Insurance for a first home mortgage is class 2 general insurance, which is also 9%.",
    source: "Queensland Revenue Office, insurance duty rates (updated 13 March 2025)",
    url: "https://qro.qld.gov.au/duties/insurance-duty/rates/",
  },
  WA: {
    rate: 0.1,
    note: "10% of the total premium.",
    source: "WA Department of Finance, insurance duty (updated 14 March 2026)",
    url: "https://www.wa.gov.au/organisation/department-of-finance/insurance-duty",
  },
  SA: {
    rate: 0.11,
    note: "11% of the premium subject to duty.",
    source: "RevenueSA, stamp duty on insurance rates",
    url: "https://www.revenuesa.sa.gov.au/stamp-duty-insurance/rates",
  },
  TAS: {
    rate: 0.1,
    note: "10% of the premium including GST (the general insurance rate since 1 October 2012).",
    source: "State Revenue Office Tasmania, rates of duty (published 5 August 2026)",
    url: "https://www.sro.tas.gov.au/insurance-duty/rates-of-duty",
  },
  NT: {
    rate: 0.1,
    note: "10% of the premium for general insurance policies.",
    source: "NT Government, examples of duty and rates",
    url: "https://nt.gov.au/employ/money-and-taxes/taxes-royalties-and-grants/stamp-duty/examples-of-duty-and-rates",
  },
  ACT: {
    rate: 0,
    note: "None: the ACT abolished insurance duty on 1 July 2016.",
    source: "ACT Revenue Office, tax reform",
    url: "https://www.revenue.act.gov.au/about-the-act-revenue-office/tax-reform",
  },
};

export type LmiStatus =
  /** LVR at or under 80%: no LMI. */
  | "no-lmi"
  /** Inside the published table. */
  | "priced"
  /** LVR above 95%: outside the table and most lenders' LMI policy. */
  | "lvr-above-table"
  /** Loan above $1,000,000: LMI still applies, but the table stops. */
  | "loan-above-table"
  /** Price or loan missing, or the loan is larger than the price. */
  | "invalid";

export interface LmiInput {
  price: number;
  /** "deposit": the loan is price minus deposit. "loan": the loan is entered directly. */
  mode: "deposit" | "loan";
  deposit: number;
  loan: number;
  state: StateCode;
  firstHomeBuyer: boolean;
}

export interface LmiResult {
  status: LmiStatus;
  loan: number;
  deposit: number;
  /** Loan to value ratio in percent, two decimals. */
  lvr: number;
  /** Deposit needed to reach 80% LVR and avoid LMI. */
  depositFor80: number;
  /** How much more deposit that is than the one entered; 0 when already there. */
  depositGapTo80: number;
  loanBand: string | null;
  lvrBand: string | null;
  /** Premium rate in percent of the loan, as published; null when not priced. */
  ratePct: number | null;
  premium: number;
  dutyRate: number;
  duty: number;
  total: number;
}

const round = (n: number) => Math.round(n);

/** LVR in percent to two decimals, the precision the table's bands are written in. */
export function lvrPct(loan: number, price: number): number {
  if (price <= 0) return 0;
  return Math.round((loan / price) * 10_000) / 100;
}

/** The table row and column for a loan, or null outside the table. */
export function lookupLmiRate(loan: number, lvr: number): { ratePct: number; loanBand: string; lvrBand: string } | null {
  if (lvr <= 80 || lvr > 95 || loan <= 0) return null;
  const bandIndex = LOAN_BANDS.findIndex((b) => loan <= b.max);
  if (bandIndex < 0) return null;
  const row = LMI_RATES.find((r) => lvr > r.lvrMin && lvr <= r.lvrMax);
  if (!row) return null;
  return {
    ratePct: row.rates[bandIndex],
    loanBand: LOAN_BANDS[bandIndex].label,
    lvrBand: `${row.lvrMin}.01% to ${row.lvrMax}%`,
  };
}

export function computeLmi(i: LmiInput): LmiResult {
  const price = Math.max(0, round(i.price));
  const loan = i.mode === "loan" ? Math.max(0, round(i.loan)) : Math.max(0, price - Math.max(0, round(i.deposit)));
  const deposit = Math.max(0, price - loan);
  const lvr = lvrPct(loan, price);
  const depositFor80 = round(price * 0.2);
  const base = {
    loan,
    deposit,
    lvr,
    depositFor80,
    depositGapTo80: Math.max(0, depositFor80 - deposit),
    loanBand: null,
    lvrBand: null,
    ratePct: null,
    premium: 0,
    dutyRate: 0,
    duty: 0,
    total: 0,
  };
  if (price <= 0 || loan <= 0 || loan > price) return { ...base, status: "invalid" };
  if (lvr <= 80) return { ...base, status: "no-lmi" };
  if (lvr > 95) return { ...base, status: "lvr-above-table" };
  const hit = lookupLmiRate(loan, lvr);
  if (!hit) return { ...base, status: "loan-above-table" };
  const premium = round((loan * hit.ratePct) / 100);
  const dutyRate = LMI_DUTY[i.state].rate;
  const duty = round(premium * dutyRate);
  return {
    ...base,
    status: "priced",
    loanBand: hit.loanBand,
    lvrBand: hit.lvrBand,
    ratePct: hit.ratePct,
    premium,
    dutyRate,
    duty,
    total: premium + duty,
  };
}

/** Premium before duty for a price and deposit share, for the page's server-rendered table. */
export function premiumAt(price: number, depositPct: number): number | null {
  const r = computeLmi({ price, mode: "deposit", deposit: round((price * depositPct) / 100), loan: 0, state: "NSW", firstHomeBuyer: false });
  return r.status === "priced" ? r.premium : null;
}

export function defaultLmiInput(): LmiInput {
  return { price: 700_000, mode: "deposit", deposit: 70_000, loan: 630_000, state: "NSW", firstHomeBuyer: true };
}
