// The First Home Super Saver (FHSS) scheme's rules, for
// /guides/first-home-super-saver-scheme, /guides/use-super-to-buy-a-house,
// /fhss-calculator and the first home buyer guides (FHSS plan, 7 Oct 2026;
// research in docs/seo-baselines/2026-10-07/fhss). Every figure is from the
// ATO, the legislation or the Australian Government, read on FHSS_CHECKED_ON.
// The shortfall interest charge rate changes every quarter and the
// concessional cap each 1 July, so recheck FHSS_SIC_RATES and
// CONCESSIONAL_CAP then; the scheme's own limits change only by legislation.

export const FHSS_CHECKED_ON = "2026-10-07";

export interface Source {
  label: string;
  href: string;
}

const ATO_FHSS =
  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/early-access-to-super/first-home-super-saver-scheme";
const ATO_RELEASE = `${ATO_FHSS}/when-you-want-to-release-your-fhss-amount`;

export const FHSS_SOURCES = {
  about: { label: "ATO: About the FHSS scheme", href: `${ATO_FHSS}/about-the-fhss-scheme` },
  rightForMe: { label: "ATO: Is the FHSS scheme right for me?", href: `${ATO_FHSS}/is-the-fhss-scheme-right-for-me` },
  eligibility: { label: "ATO: Eligibility for the FHSS scheme", href: `${ATO_FHSS}/eligibility-for-the-fhss-scheme` },
  contributions: { label: "ATO: About your contributions", href: `${ATO_FHSS}/about-your-contributions` },
  releaseAmounts: { label: "ATO: About FHSS release amounts", href: `${ATO_FHSS}/about-fhss-release-amounts` },
  determination: { label: "ATO: Step 1, request an FHSS determination", href: `${ATO_RELEASE}/step-1-request-a-fhss-determination` },
  release: { label: "ATO: Step 2, requesting the release of your super savings", href: `${ATO_RELEASE}/step-2-requesting-the-release-of-your-super-savings` },
  contract: { label: "ATO: Step 3, signing a contract for a home and notifying us", href: `${ATO_RELEASE}/step-3-signing-a-contract-for-a-home-and-notifying-us` },
  receiving: { label: "ATO: Step 4, receiving your FHSS amount", href: `${ATO_RELEASE}/step-4-receiving-your-fhss-amount` },
  taxReturn: { label: "ATO: Step 5, completing your tax return", href: `${ATO_RELEASE}/step-5-completing-your-tax-return` },
  taxAssessment: { label: "ATO: FHSS tax assessment", href: `${ATO_FHSS}/fhss-tax-assessment` },
  hardship: { label: "ATO: FHSS eligibility when you lost your property due to hardship", href: `${ATO_FHSS}/fhss-eligibility-when-you-lost-your-property-due-to-hardship` },
  previous: { label: "ATO: Previous unsuccessful FHSS scheme requests", href: `${ATO_FHSS}/previous-unsuccessful-fhss-scheme-requests` },
  guidance: { label: "ATO: Guidance Note GN 2024/1, the FHSS scheme", href: "https://www.ato.gov.au/law/view/print?DocID=GDN%2FGDN20241%2FNAT%2FATO%2F00001" },
  sic: { label: "ATO: Shortfall interest charge rates", href: "https://www.ato.gov.au/tax-rates-and-codes/shortfall-interest-charge-rates" },
  caps: { label: "ATO: Contributions caps", href: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps" },
  superGuarantee: { label: "ATO: Super guarantee percentage", href: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee" },
  usage: { label: "ATO: Usage of the FHSS scheme", href: "https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/super-statistics/early-release/first-home-super-saver-scheme-data/usage-of-the-fhss-scheme" },
  law2023: { label: "Treasury Laws Amendment (2023 Measures No. 3) Act 2023, Schedule 4", href: "https://www.legislation.gov.au/C2023A00075/asmade/text" },
  factSheet: { label: "Australian Government: First Home Super Saver Scheme fact sheet (Oct 2025)", href: "https://firsthomebuyers.gov.au/sites/default/files/2025-10/Housing%20AU%20FHSS%20Fact%20Sheet%206%20pages%20%2825%20of%2025%29%20-%20Oct%2020_2025.pdf" },
  earlyAccess: { label: "Moneysmart: When you can access your super early (29 Sep 2026)", href: "https://moneysmart.gov.au/how-super-works/when-you-can-access-your-super-early" },
  smsfProperty: { label: "Moneysmart: SMSFs and property (23 Jul 2026)", href: "https://moneysmart.gov.au/property-investment/smsfs-and-property" },
} as const satisfies Record<string, Source>;

/** Voluntary contributions counted per financial year, and in total, from 1 July 2017. */
export const FHSS_ANNUAL_LIMIT = 15_000;
export const FHSS_TOTAL_LIMIT = 50_000;
/** The total limit before it rose for determinations requested from 1 July 2022. */
export const FHSS_TOTAL_LIMIT_BEFORE_2022 = 30_000;
/** Share of counted concessional (before-tax) contributions you can release; non-concessional ones release at 100%. */
export const FHSS_CONCESSIONAL_RELEASE_PCT = 85;
/** Contributions tax the fund pays on concessional contributions. */
export const CONTRIBUTIONS_TAX_PCT = 15;
/** Non-refundable offset on the assessable FHSS released amount. */
export const FHSS_TAX_OFFSET_PCT = 30;
/** What the ATO withholds when it can't estimate your marginal rate. */
export const FHSS_DEFAULT_WITHHOLDING_PCT = 17;
/** FHSS tax on the assessable amount if you don't buy, recontribute or notify the ATO. */
export const FHSS_TAX_PCT = 20;
export const FHSS_MIN_AGE = 18;
/** Live in the home for at least this many of the first 12 months. */
export const FHSS_LIVE_IN_MONTHS = 6;
export const FHSS_RELEASE_BUSINESS_DAYS = { min: 15, max: 20 } as const;

/** The timing rules for determinations made on or after 15 September 2024 (Act No 75 of 2023, Sch 4). */
export const FHSS_TIMING = {
  changedOn: "15 September 2024",
  /** You can request the release up to this many days after signing (was 14). */
  releaseAfterSigningDays: 90,
  releaseAfterSigningDaysBefore: 14,
  /** Tell the ATO within this many days of signing (was 28). */
  notifyDays: 90,
  notifyDaysBefore: 28,
  /** Sign a contract within this many months of the release request, or recontribute. */
  contractMonths: 12,
  /** The ATO can extend that by up to this many months. */
  extensionMonths: 12,
  /** People refused between 1 July 2018 and 14 September 2024 who now own a home can apply until then. */
  transitionalDeadline: "14 September 2027",
} as const;

/**
 * The shortfall interest charge rate, % a year: the 90-day bank bill rate plus
 * 3 points, set each quarter. FHSS deemed earnings use it, compounding daily.
 * Newest first.
 */
export const FHSS_SIC_RATES = [
  { quarter: "October–December 2026", rate: 7.51 },
  { quarter: "July–September 2026", rate: 7.43 },
  { quarter: "April–June 2026", rate: 6.96 },
  { quarter: "January–March 2026", rate: 6.65 },
  { quarter: "October–December 2025", rate: 6.61 },
  { quarter: "July–September 2025", rate: 6.78 },
] as const;
export const CURRENT_SIC = FHSS_SIC_RATES[0];

/** The general concessional contributions cap, which salary sacrifice and the super guarantee share. */
export const CONCESSIONAL_CAP = { year: "2026–27", amount: 32_500, previous: 30_000 } as const;
/** Super guarantee, % of earnings, from 1 July 2025. */
export const SUPER_GUARANTEE_PCT = 12;
/** Division 293: an extra 15% on concessional contributions once income plus those contributions pass this. */
export const DIVISION_293_THRESHOLD = 250_000;

/** ATO usage figures, as at 2 July 2026. */
export const FHSS_USAGE = {
  asAt: "2 July 2026",
  latest: { year: "2025–26", determinations: 54_700, releaseRequests: 18_400, requestedMillions: 386.7, payments: 16_100, paidMillions: 330.3 },
  previous: { year: "2024–25", determinations: 52_300, releaseRequests: 18_300, requestedMillions: 364.4, payments: 15_200, paidMillions: 303.6 },
  /** Share of 2025–26 release requests within 20 business days. */
  within20DaysPct: 95,
} as const;
