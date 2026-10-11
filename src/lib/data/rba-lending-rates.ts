// Average housing lending rates from the RBA's statistical table F6, the one
// place the lending calculators take their default loan rate from. Before
// 11 Oct 2026 the mortgage and refinancing calculators opened at 6.5% and
// 5.9% with no source ("Updated April 2026"), the bridging calculator's end
// debt at 6.5%, and only the borrowing and affordability calculators used F6.
//
// To update: download https://www.rba.gov.au/statistics/tables/csv/f6-data.csv
// when the RBA publishes a new month (early each month, for the month two
// before), and change `rate`, `period`, `published` and `readOn` together.
// tests/lib/rba-lending-rates.test.ts checks the shape and that every
// calculator reads from here.

export interface F6Rate {
  /** % a year, as published (one decimal place). */
  rate: number;
  /** The month the rate is for. */
  period: string;
  /** RBA series ID in table F6. */
  series: string;
  /** What the series measures, in plain words. */
  measure: string;
}

export const F6_SOURCE = {
  name: "Reserve Bank of Australia, statistical table F6: Housing Lending Rates",
  url: "https://www.rba.gov.au/statistics/tables/",
  published: "8 October 2026",
  readOn: "10 October 2026",
} as const;

/**
 * The average rate on new owner-occupier variable-rate loans funded in the
 * month, all institutions. The default loan rate for the mortgage, refinancing
 * (new loan), bridging (end debt), borrowing power and affordability
 * calculators.
 */
export const AVERAGE_NEW_VARIABLE_RATE: F6Rate = {
  rate: 6.2,
  period: "August 2026",
  series: "FLRHOFVA",
  measure: "new owner-occupier variable-rate loans",
};

/** The average rate on all outstanding owner-occupier variable-rate loans. */
export const AVERAGE_OUTSTANDING_VARIABLE_RATE: F6Rate = {
  rate: 6.2,
  period: "August 2026",
  series: "FLRHOOVA",
  measure: "outstanding owner-occupier variable-rate loans",
};

/** The average rate on new investor variable-rate loans funded in the month. */
export const AVERAGE_NEW_INVESTOR_VARIABLE_RATE: F6Rate = {
  rate: 6.4,
  period: "August 2026",
  series: "FLRHIFVA",
  measure: "new investor variable-rate loans",
};

/**
 * The refinancing calculator's example current rate: half a point above the
 * average new variable rate. An illustration, not a published figure: in
 * August 2026 the average outstanding variable rate (FLRHOOVA) equalled the
 * average new one, so a saving depends on your own rate.
 */
export const REFINANCE_EXAMPLE_GAP = 0.5;
export const REFINANCE_EXAMPLE_CURRENT_RATE = Math.round((AVERAGE_NEW_VARIABLE_RATE.rate + REFINANCE_EXAMPLE_GAP) * 100) / 100;

/**
 * The F6 month predates the RBA's 29 September 2026 rise of 0.25 points
 * (effective 30 September); lenders' rates since then are higher. Pages that
 * print the rate print this beside it until a month after the rise is published.
 */
export const F6_RATE_CAVEAT = "before the RBA's 0.25 point rise of 29 September 2026";

/** "6.2%, the average rate on new owner-occupier variable-rate loans in August 2026 (RBA table F6)". */
export function describeF6(r: F6Rate): string {
  return `${r.rate}%, the average rate on ${r.measure} in ${r.period} (RBA table F6)`;
}
